import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import { addDays, dayMonth, monthTitle, WEEKDAY_HEADERS, weekdayIndex } from '../../utils/dates-ca';
import { IconButton } from '../icon-button/icon-button';

/**
 * Calendario de un mes para elegir un día (date picker MD3: celdas de 48 dp,
 * círculo de 40). Lo usan la hoja de tarea («Data») y «Tria el dia».
 */
@Component({
  selector: 'ap-month-picker',
  imports: [IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <span class="title" aria-live="polite">{{ title() }}</span>
      <button apIconButton type="button" icon="chevron_left" label="Mes anterior" (click)="move(-1)"></button>
      <button apIconButton type="button" icon="chevron_right" label="Mes següent" (click)="move(1)"></button>
    </div>
    <div class="grid" role="grid" [attr.aria-label]="title()">
      <div class="row" role="row">
        @for (w of weekdays; track w) {
          <span class="weekday" role="columnheader">{{ w }}</span>
        }
      </div>
      @for (week of weeks(); track $index) {
        <div class="row" role="row">
          @for (d of week; track $index) {
            @if (d) {
              <button
                type="button"
                role="gridcell"
                class="day"
                [class.selected]="d === value()"
                [class.today]="d === today()"
                [attr.aria-selected]="d === value()"
                [attr.aria-label]="label(d)"
                (click)="valueChange.emit(d)"
              >
                {{ +d.slice(8) }}
              </button>
            } @else {
              <span class="day empty" role="gridcell"></span>
            }
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .head { display: flex; align-items: center; padding-left: var(--space-100); }
    .title { flex: 1; font: 600 14px/20px var(--font-title); letter-spacing: 0.1px; }
    .row { display: grid; grid-template-columns: repeat(7, 1fr); justify-items: center; }
    .weekday { height: 40px; display: grid; place-items: center; color: var(--color-on-surface-variant); font: 500 12px/16px var(--font-text); }
    .day {
      position: relative;
      width: 40px; height: 40px; margin: 4px 0;
      border: 0; border-radius: 50%;
      background: transparent; color: var(--color-on-surface);
      font: 400 14px/20px var(--font-text);
      cursor: pointer;
    }
    .day::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: currentColor; opacity: 0; transition: opacity var(--motion-effects); }
    .day:hover::after { opacity: var(--opacity-state-hover); }
    .day.today { border: 1px solid var(--color-primary); color: var(--color-primary); }
    .day.selected { background: var(--color-primary); color: var(--color-on-primary); font-weight: 600; }
    .day.empty { cursor: default; }
  `,
})
export class MonthPicker {
  readonly value = input<string | null>(null);
  readonly today = input<string | null>(null);
  readonly valueChange = output<string>();

  /** Mes que se ve (AAAA-MM). Sigue al valor hasta que se navega. */
  protected readonly month = linkedSignal(() =>
    (this.value() || this.today() || new Date().toISOString().slice(0, 10)).slice(0, 7),
  );
  protected readonly weekdays = WEEKDAY_HEADERS;
  protected readonly title = computed(() => monthTitle(this.month()));
  protected readonly weeks = computed(() => {
    const first = `${this.month()}-01`;
    const cells: (string | null)[] = Array(weekdayIndex(first)).fill(null);
    for (let d = first; d.startsWith(this.month()); d = addDays(d, 1)) cells.push(d);
    while (cells.length % 7) cells.push(null);
    return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  });

  protected move(delta: number): void {
    const [y, m] = this.month().split('-').map(Number);
    const d = new Date(Date.UTC(y, m - 1 + delta, 1));
    this.month.set(d.toISOString().slice(0, 7));
  }

  protected label(d: string): string {
    return dayMonth(d);
  }
}
