import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AuthResponse, RegisterData, User } from './auth.models';
import { TokenStorage } from './token-storage';

/** Sesión del usuario: token, usuario actual, login, registro y cierre. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(TokenStorage);
  private readonly api = environment.apiUrl;

  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<User | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);

  /**
   * Al abrir la app: recupera el token guardado y pide el usuario.
   * Si el token ya no vale (401), se borra. Sin conexión, se mantiene.
   */
  async restore(): Promise<void> {
    const token = await this.storage.get();
    if (!token) return;
    this._token.set(token);
    try {
      this._user.set(await firstValueFrom(this.http.get<User>(`${this.api}/auth/me`)));
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 401) await this.clear();
    }
  }

  async login(email: string, password: string): Promise<User> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.api}/auth/login`, { email, password }),
    );
    await this.start(res);
    return res.user;
  }

  /** «Has oblidat la contrasenya?» (simulado: la API responde igual exista o no la cuenta). */
  async forgotPassword(email: string): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/auth/forgot-password`, { email }));
  }

  async register(data: RegisterData): Promise<User> {
    const res = await firstValueFrom(this.http.post<AuthResponse>(`${this.api}/auth/register`, data));
    await this.start(res);
    return res.user;
  }

  /** «Tancar la sessió» o token caducado. */
  async logout(): Promise<void> {
    await this.clear();
  }

  private async start(res: AuthResponse): Promise<void> {
    await this.storage.set(res.accessToken);
    this._token.set(res.accessToken);
    this._user.set(res.user);
  }

  private async clear(): Promise<void> {
    await this.storage.clear();
    this._token.set(null);
    this._user.set(null);
  }
}
