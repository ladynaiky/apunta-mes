import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { TokenStorage } from './token-storage';

const API = environment.apiUrl;
const user = { id: '1', name: 'Laia', email: 'laia@exemple.cat', role: 'student', createdAt: '' };

class MemoryStorage {
  value: string | null = null;
  get = async () => this.value;
  set = async (v: string) => void (this.value = v);
  clear = async () => void (this.value = null);
}

describe('AuthService', () => {
  let auth: AuthService;
  let http: HttpTestingController;
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenStorage, useValue: storage },
      ],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('login: guarda el token y el usuario', async () => {
    const done = auth.login('laia@exemple.cat', 'contrasenya1');
    const req = http.expectOne(`${API}/auth/login`);
    expect(req.request.body).toEqual({ email: 'laia@exemple.cat', password: 'contrasenya1' });
    req.flush({ accessToken: 'tok', user });
    await done;
    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.user()?.name).toBe('Laia');
    expect(storage.value).toBe('tok');
  });

  it('el interceptor añade el token a las llamadas a la API', async () => {
    storage.value = 'tok';
    const restored = auth.restore();
    await Promise.resolve();
    const me = http.expectOne(`${API}/auth/me`);
    expect(me.request.headers.get('Authorization')).toBe('Bearer tok');
    me.flush(user);
    await restored;
    expect(auth.user()?.email).toBe('laia@exemple.cat');
  });

  it('restore: si el token ya no vale (401), cierra la sesión', async () => {
    storage.value = 'caducat';
    const restored = auth.restore();
    await Promise.resolve();
    http.expectOne(`${API}/auth/me`).flush({ code: 'UNAUTHORIZED' }, { status: 401, statusText: '' });
    await restored;
    expect(auth.isLoggedIn()).toBe(false);
    expect(storage.value).toBeNull();
  });

  it('un 401 en una llamada normal cierra la sesión', async () => {
    storage.value = 'tok';
    const restored = auth.restore();
    await Promise.resolve();
    http.expectOne(`${API}/auth/me`).flush(user);
    await restored;

    const call = firstValueFrom(TestBed.inject(HttpClient).get(`${API}/entries/today`)).catch(() => null);
    http.expectOne(`${API}/entries/today`).flush({ code: 'UNAUTHORIZED' }, { status: 401, statusText: '' });
    await call;
    await new Promise((r) => setTimeout(r));
    expect(auth.isLoggedIn()).toBe(false);
  });

  it('logout: borra el token', async () => {
    storage.value = 'tok';
    await auth.logout();
    expect(storage.value).toBeNull();
    expect(auth.user()).toBeNull();
  });
});
