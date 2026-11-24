import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { AuthService } from '../../core/auth/auth.service';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Dialog } from '../../shared/components/dialog/dialog';
import { NavigationBar } from '../../shared/components/navigation-bar/navigation-bar';
import { TopBar } from '../../shared/components/top-bar/top-bar';

/**
 * Inici PROVISIONAL (fase 4): solo sirve para probar el acceso y el cierre
 * de sesión. La fase 5 la sustituye por la pantalla Inici del diseño.
 */
@Component({
  selector: 'ap-home-placeholder-page',
  imports: [IonContent, Button, Dialog, NavigationBar, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="ca.app.name" [brand]="true" [showBack]="false" />
    <ion-content>
      <main class="page">
        <p class="title-medium">Hola, {{ auth.user()?.name }}</p>
        <p class="body-medium muted">{{ auth.user()?.email }}</p>
        <p class="body-medium muted">Pantalla provisional: la Inici del disseny arriba a la fase 5.</p>
        <button apButton type="button" variant="outlined" icon="logout" (click)="confirmOpen.set(true)">
          {{ ca.session.logout }}
        </button>
      </main>
    </ion-content>
    <ap-navigation-bar active="home" />
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
