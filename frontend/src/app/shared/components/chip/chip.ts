import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { SubjectColorToken } from '../../utils/task-title';
import { Badge } from '../badge/badge';
import { Icon } from '../icon/icon';
import { SubjectDot } from '../subject-dot/subject-dot';

/**
 * Chip de filtro (siempre interactivo): 32 dp con zona táctil de 48.
 *   <button apChip [selected]="…" subjectColor="blau" [count]="1">Mates</button>
 */
@Component({
  selector: 'button[apChip]',
  imports: [Badge, Icon, SubjectDot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (selected()) {
      <ap-icon name="check" [size]="18" />
    } @else if (subjectColor()) {
      <ap-subject-dot [color]="subjectColor()" [size]="10" />
    }
    <span><ng-content /></span>
    @if (count() !== null) {
      <ap-badge [count]="count()" />
    }
  `,
  styles: `
    :host {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: var(--space-100);
      box-sizing: border-box;
      height: var(--size-chip);
      padding: 0 var(--space-150) 0 var(--space-100);
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--shape-corner-small);
      background: transparent;
      color: var(--color-on-surface);
      font: 400 14px/20px var(--font-text);
      letter-spacing: 0.1px;
      white-space: nowrap;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    :host::before { content: ''; position: absolute; inset: -8px 0; }
    :host::after {
      content: ''; position: absolute; inset: 0; border-radius: inherit;
      background: currentColor; opacity: 0; pointer-events: none;
      transition: opacity var(--motion-effects);
    }
    :host(:hover)::after { opacity: var(--opacity-state-hover); }
    :host(:active)::after { opacity: var(--opacity-state-pressed); }
    :host(.selected) {
      border-color: transparent;
      background: var(--color-secondary-container);
      color: var(--color-on-secondary-container);
    }
  `,
  host: {
    type: 'button',
    '[class.selected]': 'selected()',
    '[attr.aria-pressed]': 'selected()',
  },
})
export class Chip {
  readonly selected = input(false);
  readonly subjectColor = input<SubjectColorToken | null>(null);
  readonly count = input<number | null>(null);
}
