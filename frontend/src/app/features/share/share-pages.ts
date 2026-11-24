import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Icon } from '../../shared/components/icon/icon';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { MeShare } from '../me/me-share';
import { ShareForm } from './share-form';

const PAGE_STYLES = `
  :host { display: flex; flex-direction: column; height: 100%; }
  ion-content { flex: 1; }
  .page { display: flex; flex-direction: column; gap: var(--space-200); padding: var(--space-300) var(--size-layout-margin); }
  .text { margin: 0; font: 400 16px/24px var(--font-text); letter-spacing: 0.5px; }
  .link-field {
    position: relative; display: flex; align-items: center;
    box-sizing: border-box; height: var(--size-text-field); padding: 0 15px;
    border: 1px solid var(--color-outline); border-radius: var(--shape-corner-extra-small);
    font: 400 16px/24px var(--font-text); overflow-wrap: anywhere; user-select: all;
  }
  .float-label { position: absolute; top: -9px; left: 12px; padding: 0 4px; background: var(--color-surface); color: var(--color-on-surface-variant); font: 400 12px/16px var(--font-text); }
  .bottom { padding: var(--space-150) var(--size-layout-margin) var(--space-200); background: var(--color-surface); }
  .done { display: flex; flex-direction: column; align-items: center; gap: var(--space-100); padding: var(--space-300) 0 var(--space-100); text-align: center; }
  .done ap-icon { color: var(--color-primary-container); }
  .done h2 { margin: 0; font: 600 22px/28px var(--font-title); }
  .done p { margin: 0; color: var(--color-on-surface-variant); font: 400 14px/20px var(--font-text); }
`;

/** Compartir (simulado): qué y con quién → «Generar l’enllaç». */
@Component({
  selector: 'ap-share-page',
  imports: [IonContent, TopBar, ShareForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.title" (back)="nav.back()" />
    <ion-content>
      <main class="page"><ap-share-form [from]="from() ?? 'home'" /></main>
    </ion-content>
  `,
  styles: PAGE_STYLES,
})
export class SharePage {
  readonly from = input<string | undefined>();
  protected readonly nav = inject(NavController);
  protected readonly t = ca.share;
}

/** Compartir tasques: marcar qué tareas ve la familia y, debajo, el formulario de Compartir. */
@Component({
  selector: 'ap-share-tasks-page',
  imports: [IonContent, TopBar, MeShare, ShareForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.tasksTitle" (back)="nav.back()" />
    <ion-content>
      <main class="page">
        <ap-me-share [showFooter]="false" />
        <ap-share-form [from]="from() ?? 'tasks'" />
      </main>
    </ion-content>
  `,
  styles: PAGE_STYLES,
})
export class ShareTasksPage {
  readonly from = input<string | undefined>();
  protected readonly nav = inject(NavController);
  protected readonly t = ca.share;
}

/** Generar enllaç: muestra el enlace y «Copiar l’enllaç» (portapapeles del sistema). */
@Component({
  selector: 'ap-share-link-page',
  imports: [IonContent, Button, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.linkTitle" (back)="nav.back()" />
    <ion-content>
      <main class="page">
        <p class="text">{{ t.linkText }}</p>
        <div class="link-field" [attr.aria-label]="t.linkLabel" role="textbox" aria-readonly="true">
          <span class="float-label">{{ t.link }}</span>{{ url() }}
        </div>
      </main>
    </ion-content>
    <div class="bottom">
      <button apButton type="button" variant="filled" size="m" icon="content_copy" [block]="true" [disabled]="copying()" (click)="copy()">
        {{ t.copy }}
      </button>
    </div>
  `,
  styles: PAGE_STYLES,
})
export class ShareLinkPage {
  readonly url = input('');
  readonly from = input<string | undefined>();
  protected readonly nav = inject(NavController);
  private readonly snackbar = inject(SnackbarService);
  protected readonly t = ca.share;
  protected readonly copying = signal(false);

  protected async copy(): Promise<void> {
    this.copying.set(true);
    try {
      await navigator.clipboard.writeText(this.url());
      await this.nav.navigateForward('/share/link/copied', {
        queryParams: { url: this.url(), from: this.from() ?? 'home' },
        replaceUrl: true,
      });
    } catch {
      // Sin permiso de portapapeles: el enlace sigue a la vista para copiarlo a mano.
      this.snackbar.show(this.t.copyFailed);
    } finally {
      this.copying.set(false);
    }
  }
}

/** Compartir enllaç: «Enllaç copiat» y «Tornar a Inici». */
@Component({
  selector: 'ap-share-copied-page',
  imports: [IonContent, Button, Icon, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.copiedTitle" [showBack]="false" />
    <ion-content>
      <main class="page">
        <section class="done" aria-labelledby="copied-title">
          <ap-icon name="check_circle" [size]="48" />
          <h2 id="copied-title">{{ t.copied }}</h2>
          <p>{{ t.copiedText }}</p>
        </section>
        <div class="link-field" [attr.aria-label]="t.linkLabel" role="textbox" aria-readonly="true">
          <span class="float-label">{{ t.link }}</span>{{ url() }}
        </div>
      </main>
    </ion-content>
    <div class="bottom">
      <button apButton type="button" variant="filled" size="m" icon="home" [block]="true" (click)="home()">{{ t.backHome }}</button>
    </div>
  `,
  styles: PAGE_STYLES,
})
export class ShareCopiedPage {
  readonly url = input('');
  private readonly nav = inject(NavController);
  protected readonly t = ca.share;

  protected home(): void {
    void this.nav.navigateRoot('/tabs/home');
  }
}
