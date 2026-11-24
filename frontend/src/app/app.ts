import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { Snackbar } from './shared/components/snackbar/snackbar';
import { TaskSheet } from './shared/components/task-sheet/task-sheet';
import { TaskSheetService } from './shared/components/task-sheet/task-sheet.service';

@Component({
  selector: 'ap-root',
  imports: [IonApp, IonRouterOutlet, Snackbar, TaskSheet],
  template: `
    <ion-app>
      <ion-router-outlet />
      <ap-task-sheet [entry]="sheet.entry()" [from]="sheet.from()" (closed)="sheet.close()" />
      <ap-snackbar />
    </ion-app>
  `,
})
export class App {
  protected readonly sheet = inject(TaskSheetService);
}
