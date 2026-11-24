import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { CalendarDot } from '../../../core/data/models';
import { weekdayShort } from '../../utils/dates-ca';
import { SubjectDot } from '../subject-dot/subject-dot';

/**
 * Calendario semanal (calendar/week del Design System): 7 píldoras con el día
 * de la semana, el número y hasta 3 puntos de asignatura («+» si hay más).
 * El nombre accesible dice cuántas cosas hay («4 de novembre, 3 tasques»).
 */
@Component({
  selector: 'ap-week-calendar',
  imports: [SubjectDot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="week">
      @for (d of days(); track d) {
        <button
          type="button"
          class="pill"
          [class.selected]="d === selected()"
          [class.today]="d === today()"
          [attr.aria-label]="ariaLabel()(d, (dots()[d] ?? []).length)"
          [attr.aria-current]="d === today() ? 'date' : null"
          (click)="select.emit(d)"
        >
          <span class="weekday">{{ weekday(d) }}</span>
          <span class="number">{{ +d.slice(8) }}</span>
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
      }
    </div>
  `,
  styles: `
    .week { display: grid; grid-template-columns: repeat(7, 1fr); gap: var(--space-50); }
    .pill {
      position: relative;
      display: flex; flex-direction: column; align-items: center; gap: var(--space-50);
      height: var(--space-900);
      padding: var(--space-100) 0;
      border: 0; border-radius: var(--shape-corner-full);
      background: var(--color-surface-container-low);
      color: var(--color-on-surface);
      cursor: pointer;
    }
    .pill::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: currentColor; opacity: 0; transition: opacity var(--motion-effects); }
    .pill:hover::after { opacity: var(--opacity-state-hover); }
    .pill:active::after { opacity: var(--opacity-state-pressed); }
    .pill.today { box-shadow: inset 0 0 0 1px var(--color-primary); }
    .pill.selected { background: var(--color-primary); color: var(--color-on-primary); }
    .weekday { font: 500 12px/16px var(--font-text); letter-spacing: 0.5px; color: var(--color-on-surface-variant); }
    .selected .weekday { color: var(--color-on-primary); }
    .number { font: 600 16px/20px var(--font-title); }
    .dots { display: flex; gap: var(--space-25); height: 8px; align-items: center; }
    /* Sobre el día elegido, cada punto lleva un anillo claro para no perderse. */
    .selected ap-subject-dot { box-shadow: 0 0 0 1.5px var(--color-on-primary); }
    .more { font: 700 10px/8px var(--font-text); }
  `,
})
export class WeekCalendar {
  readonly days = input.required<string[]>();
  readonly selected = input<string | null>(null);
  readonly today = input<string | null>(null);
  readonly dots = input<Record<string, CalendarDot[]>>({});
  /** (fecha, número) → «4 de novembre, 3 tasques» */
  readonly ariaLabel = input.required<(date: string, count: number) => string>();
  readonly select = output<string>();

  protected weekday(d: string): string {
    return weekdayShort(d);
  }
}
