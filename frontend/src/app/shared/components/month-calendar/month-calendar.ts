import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { CalendarDot } from '../../../core/data/models';
import { addDays, WEEKDAY_HEADERS, weekdayIndex } from '../../utils/dates-ca';
import { SubjectDot } from '../subject-dot/subject-dot';

/**
 * Calendario mensual (calendar/month del Design System): celdas de 56 dp con
 * círculo de 40 y, debajo, hasta 3 puntos de asignatura («+» si hay más).
 * Hoy, con borde verde; el día elegido, relleno verde (los puntos quedan fuera).
 */
@Component({
  selector: 'ap-month-calendar',
  imports: [SubjectDot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid" role="grid" [attr.aria-label]="label()">
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
                class="cell"
                [attr.aria-label]="ariaLabel()(d, (dots()[d] ?? []).length)"
                [attr.aria-current]="d === today() ? 'date' : null"
                [attr.aria-selected]="d === selected()"
                (click)="select.emit(d)"
              >
                <span class="day" [class.today]="d === today()" [class.selected]="d === selected()">{{ +d.slice(8) }}</span>
                <span class="dots" aria-hidden="true">
                  @for (dot of (dots()[d] ?? []).slice(0, 3); track $index; let i = $index) {
                    @if (i === 2 && (dots()[d] ?? []).length > 3) {
                      <span class="more">+</span>
                    } @else {
                      <ap-subject-dot [color]="dot.colorToken" [size]="6" />
                    }
                  }
                </span>
              </button>
            } @else {
              <span class="cell empty" role="gridcell"></span>
            }
          }
        </div>
      }
    </div>
  `,
  styles: `
    .row { display: grid; grid-template-columns: repeat(7, 1fr); }
    .weekday { height: 32px; display: grid; place-items: center; color: var(--color-on-surface-variant); font: 500 12px/16px var(--font-text); }
    .cell {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      height: var(--size-calendar-cell);
      padding: 0; border: 0; background: transparent; cursor: pointer;
      color: var(--color-on-surface);
    }
    .cell.empty { cursor: default; }
    .day {
      position: relative;
      display: grid; place-items: center;
      width: var(--size-day); height: var(--size-day);
      border-radius: 50%;
      font: 400 14px/20px var(--font-text);
    }
    .day::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: currentColor; opacity: 0; transition: opacity var(--motion-effects); }
    .cell:hover .day::after { opacity: var(--opacity-state-hover); }
    .cell:active .day::after { opacity: var(--opacity-state-pressed); }
    .cell:focus-visible { outline: none; }
    .cell:focus-visible .day { outline: var(--size-focus-ring) solid var(--color-secondary); outline-offset: 2px; }
    .day.today { box-shadow: inset 0 0 0 1px var(--color-primary); color: var(--color-primary); font-weight: 600; }
    .day.selected { background: var(--color-primary); color: var(--color-on-primary); font-weight: 600; }
    .dots { display: flex; gap: var(--space-25); height: 8px; align-items: center; }
    .more { font: 700 10px/8px var(--font-text); }
  `,
})
export class MonthCalendar {
  /** AAAA-MM */
  readonly month = input.required<string>();
  readonly today = input<string | null>(null);
  readonly selected = input<string | null>(null);
  readonly dots = input<Record<string, CalendarDot[]>>({});
  readonly label = input.required<string>();
  readonly ariaLabel = input.required<(date: string, count: number) => string>();
  readonly select = output<string>();

  protected readonly weekdays = WEEKDAY_HEADERS;
  protected readonly weeks = computed(() => {
    const first = `${this.month()}-01`;
    const cells: (string | null)[] = Array(weekdayIndex(first)).fill(null);
    for (let d = first; d.startsWith(this.month()); d = addDays(d, 1)) cells.push(d);
    while (cells.length % 7) cells.push(null);
    return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  });
}
