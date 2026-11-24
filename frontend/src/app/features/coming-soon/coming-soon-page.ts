import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TopBar } from '../../shared/components/top-bar/top-bar';

/**
 * Pantalla PROVISIONAL para los accesos a pantallas que llegan en las fases
 * 6 y 7. Tiene el título correcto y «Enrere», así el flujo no se rompe.
 */
@Component({
  selector: 'ap-coming-soon-page',
  imports: [IonContent, StateMessage, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="title()" (back)="nav.back()" />
    <ion-content>
      <ap-state-message class="msg" title="Aquesta pantalla arriba aviat." />
    </ion-content>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .msg { margin-top: 30%; }
  `,
})
export class ComingSoonPage {
  /** Viene de `data.title` de la ruta. */
  readonly title = input('');
  protected readonly nav = inject(NavController);
}
