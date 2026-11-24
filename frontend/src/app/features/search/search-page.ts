import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import { TasksStore } from '../../core/data/tasks.store';
import { TodayService } from '../../core/data/today.service';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { DateField } from '../../shared/components/date-field/date-field';
import { Select, type SelectOption } from '../../shared/components/select/select';
import { TextField } from '../../shared/components/text-field/text-field';
import { TopBar } from '../../shared/components/top-bar/top-bar';

/** Buscar/Filtrar: por nombre, asignatura y día. «Buscar la tasca» abre los resultados. */
@Component({
  selector: 'ap-search-page',
  imports: [FormsModule, IonContent, Button, DateField, Select, TextField, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.title" (back)="nav.back()" />
    <ion-content>
      <form id="search-form" class="page" role="search" novalidate (ngSubmit)="submit()">
        <ap-text-field [label]="t.search" type="search" [placeholder]="t.placeholder" name="q" [(ngModel)]="q" />
        <ap-select [label]="t.subject" [options]="subjectOptions()" name="subject" [(ngModel)]="subject" />
        <ap-date-field
          [label]="t.date"
          [placeholder]="t.allDates"
          [value]="date()"
          [today]="today()"
          [clearable]="true"
          (valueChange)="date.set($event)"
        />
      </form>
    </ion-content>
    <div class="bottom">
      <button apButton type="submit" form="search-form" variant="filled" size="m" icon="search" [block]="true">{{ t.submit }}</button>
    </div>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page { display: flex; flex-direction: column; gap: var(--space-300); padding: var(--space-300) var(--size-layout-margin); }
    .bottom { padding: var(--space-150) var(--size-layout-margin) var(--space-200); background: var(--color-surface); }
  `,
})
export class SearchPage implements OnInit, ViewWillEnter {
  readonly from = input<string | undefined>();

  private readonly store = inject(TasksStore);
  private readonly todayService = inject(TodayService);
  protected readonly nav = inject(NavController);
  protected readonly t = ca.search;

  protected readonly q = signal('');
  /** '' = Totes. */
  protected readonly subject = signal('');
  protected readonly date = signal<string | null>(null);
  protected readonly today = signal('');
  protected readonly subjectOptions = computed<SelectOption<string>[]>(() => [
    { value: '', label: this.t.allSubjects },
    ...this.store.subjects().map((s) => ({ value: s.id, label: s.name, color: s.colorToken })),
  ]);

  async ngOnInit(): Promise<void> {
    this.today.set(await this.todayService.load());
  }

  ionViewWillEnter(): void {
    if (!this.store.subjects().length) void this.store.load();
  }

  protected submit(): void {
    const query: Record<string, string> = { from: this.from() ?? 'tasks' };
    if (this.q().trim()) query['q'] = this.q().trim();
    if (this.subject()) query['subject'] = this.subject();
    if (this.date()) query['date'] = this.date()!;
    void this.nav.navigateForward('/search/results', { queryParams: query });
  }
}
