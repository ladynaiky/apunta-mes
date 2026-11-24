import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'apunta.token';

/**
 * Guarda el JWT. En Android usa el almacenamiento privado de la app
 * (Capacitor Preferences); en el navegador, localStorage.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorage {
  async get(): Promise<string | null> {
    return (await Preferences.get({ key: TOKEN_KEY })).value;
  }

  async set(token: string): Promise<void> {
    await Preferences.set({ key: TOKEN_KEY, value: token });
  }

  async clear(): Promise<void> {
    await Preferences.remove({ key: TOKEN_KEY });
  }
}
