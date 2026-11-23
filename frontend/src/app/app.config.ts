import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Modo Material (md) en todas las plataformas, como el diseño Android.
    provideIonicAngular({ mode: 'md' }),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
