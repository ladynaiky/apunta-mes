import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { AuthService } from '../../core/auth/auth.service';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Dialog } from '../../shared/components/dialog/dialog';
import { TopBar } from '../../shared/components/top-bar/top-bar';

/**
 * Pantalla PROVISIONAL de Tasques, IA y El meu espai hasta después del punto
 * de control de la fase 5. Incluye «Tancar la sessió» para poder salir.
 */
@Component({
  selector: 'ap-home-placeholder-page',
  imports: [IonContent, Button, Dialog, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="title()" [showBack]="false" />
    <ion-content>
      <main class="page">
        <p class="body-medium muted">Pantalla provisional: arriba després del punt de control.</p>
        <p class="body-medium muted">{{ auth.user()?.email }}</p>
        <button apButton type="button" variant="outlined" icon="logout" (click)="confirmOpen.set(true)">
          {{ ca.session.logout }}
        </button>
      </main>
    </ion-content>
    <ap-dialog
      [open]="confirmOpen()"
      [headline]="ca.session.logoutQuestion"
      [confirmLabel]="ca.session.logout"
      (confirm)="logout()"
      (cancel)="confirmOpen.set(false)"
    />
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-100); padding: var(--space-200) var(--size-layout-margin); }
    p { margin: 0; }
    .muted { color: var(--color-on-surface-variant); }
    button { margin-top: var(--space-300); }
  `,
})
export class HomePlaceholderPage {
  readonly title = input('');
  protected readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);
  protected readonly ca = ca;
  protected readonly confirmOpen = signal(false);

  protected async logout(): Promise<void> {
    this.confirmOpen.set(false);
    await this.auth.logout();
    await this.nav.navigateRoot('/login');
  }
}
