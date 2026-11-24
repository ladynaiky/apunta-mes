import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { AuthService } from '../../core/auth/auth.service';
import { TasksStore } from '../../core/data/tasks.store';
import { TodayService } from '../../core/data/today.service';
import { DemoStateService, type DemoState } from '../../core/demo/demo-state.service';
import { ButtonGroup } from '../../shared/components/button-group/button-group';
import { ca } from '../../i18n/ca';
import { Dialog } from '../../shared/components/dialog/dialog';
import { Icon } from '../../shared/components/icon/icon';
import { Tabs } from '../../shared/components/tabs/tabs';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { MeContacts } from './me-contacts';
import { MeCustomize } from './me-customize';
import { MeReminders } from './me-reminders';
import { MeShare } from './me-share';
import { MeSync } from './me-sync';

type MeTab = 'reminders' | 'share' | 'customize' | 'contacts';

/** El meu espai: Avisos · Compartir · Personalitzar · Contactes, y «Tancar la sessió». */
@Component({
  selector: 'ap-me-page',
  imports: [IonContent, ButtonGroup, Dialog, Icon, Tabs, TopBar, MeContacts, MeCustomize, MeReminders, MeShare, MeSync],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.title" (back)="nav.back()" />
    <ap-tabs idPrefix="me" [label]="t.title" [tabs]="tabs" [value]="tab()" (valueChange)="tab.set($any($event))" />
    <ion-content>
      <main class="page" id="me-panel" role="tabpanel" [attr.aria-labelledby]="'me-tab-' + tab()">
        <!-- Se vuelve a crear al cambiar el modo demo, para recargar los datos. -->
        @for (v of [version()]; track v) {
          @switch (tab()) {
            @case ('reminders') { <ap-me-reminders /> }
            @case ('share') { <ap-me-sync /> <ap-me-share /> }
            @case ('customize') { <ap-me-customize /> }
            @case ('contacts') { <ap-me-contacts /> }
          }
        }

        @if (today.demoMode()) {
          <section class="demo" aria-labelledby="demo-title">
            <h2 id="demo-title">{{ t.demo.title }}</h2>
            <p>{{ t.demo.intro }}</p>
            <ap-button-group [label]="t.demo.label" [options]="demoOptions" [value]="demo.state()" (valueChange)="setDemo($any($event))" />
          </section>
        }

        <button type="button" class="logout" (click)="confirmOpen.set(true)">
          <ap-icon name="logout" />
          <span>{{ ca.session.logout }}</span>
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
    .page { padding: var(--space-200) var(--size-layout-margin) var(--space-400); }
    .logout {
      display: flex; align-items: center; gap: var(--space-200);
      width: 100%; min-height: var(--size-list-item-one-line);
      margin-top: var(--space-400); padding: 0 var(--space-100);
      border: 0; border-top: 1px solid var(--color-outline-variant);
      background: transparent; color: var(--color-on-surface);
      font: 400 16px/24px var(--font-text); text-align: left; cursor: pointer;
    }
    .logout ap-icon { color: var(--color-on-surface-variant); }
    .demo { margin-top: var(--space-400); padding: var(--space-200); border-radius: var(--shape-corner-large); background: var(--color-surface-container-low); }
    .demo h2 { margin: 0 0 var(--space-50); font: 600 16px/24px var(--font-title); }
    .demo p { margin: 0 0 var(--space-150); color: var(--color-on-surface-variant); font: 400 14px/20px var(--font-text); }
    .logout:hover { background: rgb(28 27 27 / var(--opacity-state-hover)); }
  `,
})
export class MePage {
  /** ?tab=customize… (Personalització, Sincronitzar y Avís de pendents abren su pestaña). */
  readonly initialTab = input<MeTab | undefined>(undefined, { alias: 'tab' });
  protected readonly nav = inject(NavController);
  private readonly auth = inject(AuthService);
  protected readonly t = ca.me;
  protected readonly ca = ca;
  protected readonly tabs = (['reminders', 'share', 'customize', 'contacts'] as MeTab[]).map((v) => ({
    value: v,
    label: ca.me.tabs[v],
    icon: ({ reminders: 'notifications', share: 'share', customize: 'palette', contacts: 'group' } as const)[v],
  }));
  protected readonly tab = signal<MeTab>('reminders');
  protected readonly confirmOpen = signal(false);
  protected readonly today = inject(TodayService);
  protected readonly demo = inject(DemoStateService);
  private readonly store = inject(TasksStore);
  protected readonly version = signal(0);
  protected readonly demoOptions = (['normal', 'empty', 'error'] as DemoState[]).map((v) => ({
    value: v,
    label: ca.me.demo.options[v],
  }));

  /** Cambia el modo demo y recarga los datos (aquí y en el resto de pantallas). */
  protected setDemo(state: DemoState): void {
    this.demo.set(state);
    this.version.update((n) => n + 1);
    void this.store.load().then(() => this.store.changes.update((n) => n + 1));
  }

  ngOnInit(): void {
    const t = this.initialTab();
    if (t) this.tab.set(t);
    void this.today.load();
  }

  protected async logout(): Promise<void> {
    this.confirmOpen.set(false);
    await this.auth.logout();
    await this.nav.navigateRoot('/login');
  }
}
