import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { Snackbar } from './shared/components/snackbar/snackbar';

@Component({
  selector: 'ap-root',
  imports: [IonApp, IonRouterOutlet, Snackbar],
  template: `
    <ion-app>
      <ion-router-outlet />
      <ap-snackbar />
    </ion-app>
  `,
})
export class App {}
