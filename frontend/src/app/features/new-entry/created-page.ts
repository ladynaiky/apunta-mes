import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { ApiService } from '../../core/data/api.service';
import type { Entry } from '../../core/data/models';
import { TodayService } from '../../core/data/today.service';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Icon } from '../../shared/components/icon/icon';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { dueLabel } from '../../shared/utils/dates-ca';
import { originUrl } from '../../shared/utils/origin';

/** «Tasca creada» (y examen, excursión, aniversario): «Vols compartir? No / Sí». */
@Component({
  selector: 'ap-created-page',
  imports: [IonContent, Button, Icon, TaskRow, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.titles[type()]" [showBack]="false" />
    <ion-content>
      <main class="page">
        <section class="done" aria-labelledby="created-title">
          <ap-icon name="check_circle" [size]="48" />
          <h2 id="created-title">{{ t.titles[type()] }}</h2>
          <p>{{ t.text }}</p>
        </section>

        @if (entry(); as e) {
          <ap-task-row
            [subjectName]="e.subject?.name ?? (e.type === 'trip' ? ca.sheet.kind['trip'] : e.type === 'birthday' ? ca.sheet.kind['birthday'] : null)"
            [subjectColor]="e.subject?.colorToken ?? null"
            [title]="e.title"
            [supporting]="due()"
            [done]="e.done"
            [highPriority]="e.priority === 'high'"
            [showCheckbox]="false"
            [lowercaseTitle]="!!e.subject"
            (open)="sheet.open(e, 'created')"
            (menu)="sheet.open(e, 'created')"
          />
        }

        <div class="share">
          <h3>{{ t.share }}</h3>
          <div class="actions">
            <button apButton type="button" variant="outlined" size="m" [attr.aria-label]="(from() ?? 'home') === 'home' ? t.noLabel : t.noBackLabel" (click)="no()">{{ t.no }}</button>
            <button apButton type="button" variant="filled" size="m" [attr.aria-label]="t.yesLabel" (click)="yes()">{{ t.yes }}</button>
          </div>
        </div>
      </main>
    </ion-content>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page { display: flex; flex-direction: column; gap: var(--space-200); padding: var(--space-200) var(--size-layout-margin); }
    .done { display: flex; flex-direction: column; align-items: center; gap: var(--space-100); padding: var(--space-300) 0 var(--space-100); text-align: center; }
    .done ap-icon { color: var(--color-primary-container); }
    .done h2 { margin: 0; font: 600 22px/28px var(--font-title); }
    .done p { margin: 0; color: var(--color-on-surface-variant); font: 400 14px/20px var(--font-text); }
    .share { margin-top: var(--space-300); }
    .share h3 { margin: 0 0 var(--space-150); font: 600 16px/24px var(--font-title); }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-150); }
  `,
})
export class CreatedPage implements OnInit {
  readonly typeParam = input<string>('task', { alias: 'type' });
  readonly id = input.required<string>();
  readonly from = input<string | undefined>();

  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  private readonly nav = inject(NavController);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly t = ca.created;
  protected readonly ca = ca;
  protected readonly entry = signal<Entry | null>(null);
  protected readonly due = signal('');

  protected type(): string {
    return this.entry()?.type ?? this.typeParam();
  }

  async ngOnInit(): Promise<void> {
    const [entry, today] = await Promise.all([this.api.entry(this.id()), this.todayService.load()]);
    this.entry.set(entry);
    this.due.set(dueLabel(entry.date, today));
  }

  /** «No»: vuelve a la pantalla de origen. */
  protected no(): void {
    void this.nav.navigateRoot(originUrl(this.from()));
  }

  protected yes(): void {
    void this.nav.navigateForward('/share', { queryParams: { from: this.from() ?? 'home' } });
  }
}
