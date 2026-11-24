import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { ca } from '../../../i18n/ca';
import { Button } from '../../../shared/components/button/button';
import { Icon } from '../../../shared/components/icon/icon';
import { TopBar } from '../../../shared/components/top-bar/top-bar';

/** Compte creat: bienvenida y «Començar» → Inici. */
@Component({
  selector: 'ap-account-created-page',
  imports: [IonContent, Button, Icon, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.title" [showBack]="false" />
    <ion-content>
      <main class="page">
        <section class="welcome" aria-labelledby="welcome-title">
          <ap-icon name="check_circle" [size]="48" />
          <h2 id="welcome-title">{{ t.welcome }}</h2>
          <p>{{ t.text }}</p>
        </section>

        <h3 class="what-now">{{ t.whatNow }}</h3>
        <ul class="list">
          @for (item of t.items; track item.title) {
            <li>
              <span class="icon"><ap-icon [name]="item.icon" /></span>
              <span class="text">
                <strong>{{ item.title }}</strong>
                <span>{{ item.text }}</span>
              </span>
            </li>
          }
        </ul>

        <button apButton type="button" variant="filled" size="m" [block]="true" class="start" (click)="start()">
          {{ t.start }}
        </button>
      </main>
    </ion-content>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      min-height: 100%;
      padding: var(--space-200) var(--size-layout-margin) var(--space-400);
    }
    .welcome { display: flex; flex-direction: column; align-items: center; gap: var(--space-100); padding: var(--space-300) var(--space-200); text-align: center; }
    .welcome ap-icon { color: var(--color-primary-container); margin-bottom: var(--space-100); }
    .welcome h2 { margin: 0; font: 600 22px/28px var(--font-title); }
    .welcome p { margin: 0; color: var(--color-on-surface-variant); font: 400 14px/20px var(--font-text); letter-spacing: 0.25px; }
    .what-now { margin: var(--space-300) 0 var(--space-100); color: var(--color-on-surface-variant); font: 600 14px/20px var(--font-title); letter-spacing: 0.1px; }
    .list { margin: 0; padding: 0; list-style: none; }
    li { display: flex; align-items: center; gap: var(--space-200); min-height: var(--size-list-item-two-line); }
    .icon {
      display: inline-flex; align-items: center; justify-content: center; flex: none;
      width: 40px; height: 40px; border-radius: var(--shape-corner-full);
      background: var(--color-secondary-container); color: var(--color-on-secondary-container);
    }
    .text { display: flex; flex-direction: column; }
    .text strong { font: 500 16px/24px var(--font-text); letter-spacing: 0.5px; }
    .text span { color: var(--color-on-surface-variant); font: 400 14px/20px var(--font-text); letter-spacing: 0.25px; }
    .start { margin-top: auto; }
  `,
})
export class AccountCreatedPage {
  private readonly nav = inject(NavController);
  protected readonly t = ca.accountCreated;

  protected start(): void {
    void this.nav.navigateRoot('/tabs/home');
  }
}
