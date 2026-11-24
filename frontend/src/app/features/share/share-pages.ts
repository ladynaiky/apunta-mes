import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { ShareFlowService } from '../../shared/components/share-flow/share-flow.service';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { MeShare } from '../me/me-share';

/**
 * Compartir tasques: marcar qué tareas ve la familia. El botón abre el modal de Compartir
 * (iteración 1: Compartir, Generar enllaç y Compartir enllaç son pasos de un modal).
 */
@Component({
  selector: 'ap-share-tasks-page',
  imports: [IonContent, Button, TopBar, MeShare],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.tasksTitle" (back)="nav.back()" />
    <ion-content>
      <main class="page">
        <ap-me-share [showFooter]="false" />
      </main>
    </ion-content>
    <div class="bottom">
      <button apButton type="button" variant="filled" size="m" icon="share" [block]="true" (click)="shareFlow.share()">{{ ca.me.shareMarked }}</button>
    </div>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page { display: flex; flex-direction: column; gap: var(--space-200); padding: var(--space-300) var(--size-layout-margin); }
    .bottom { padding: var(--space-150) var(--size-layout-margin) var(--space-200); background: var(--color-surface); }
  `,
})
export class ShareTasksPage {
  protected readonly nav = inject(NavController);
  protected readonly shareFlow = inject(ShareFlowService);
  protected readonly t = ca.share;
  protected readonly ca = ca;
}
