import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ca } from '../../../i18n/ca';
import { taskLabel, type SubjectColorToken } from '../../utils/task-title';
import { Checkbox } from '../checkbox/checkbox';
import { IconButton } from '../icon-button/icon-button';
import { SubjectDot } from '../subject-dot/subject-dot';

/**
 * Fila de tarea (list item de dos líneas, 72 dp):
 * [casilla] [punto] «Assignatura: acció» · texto de apoyo · etiquetas · [⋮]
 * El nombre de la asignatura siempre va escrito; el punto es solo apoyo.
 */
@Component({
  selector: 'ap-task-row',
  imports: [Checkbox, IconButton, SubjectDot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-row.html',
  styleUrl: './task-row.scss',
})
export class TaskRow {
  readonly subjectName = input<string | null>(null);
  readonly subjectColor = input<SubjectColorToken | null>(null);
  readonly title = input.required<string>();
  /** «Per a avui», «Per al 12 de novembre»… */
  readonly supporting = input<string | null>(null);
  readonly done = input(false);
  readonly highPriority = input(false);
  readonly showCheckbox = input(true);
  readonly showMenu = input(true);
  readonly showTags = input(true);

  readonly doneChange = output<boolean>();
  readonly open = output<void>();
  readonly menu = output<void>();

  protected readonly t = ca.task;
  protected readonly label = computed(() => taskLabel(this.subjectName(), this.title()));
  protected readonly checkLabel = computed(() =>
    this.done() ? this.t.unmarkDone(this.label()) : this.t.markDone(this.label()),
  );
}
