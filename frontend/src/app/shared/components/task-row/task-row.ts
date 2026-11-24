import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ca } from '../../../i18n/ca';
import { taskLabel } from '../../utils/task-title';
import { Checkbox } from '../checkbox/checkbox';
import { IconButton } from '../icon-button/icon-button';

/**
 * Fila de tarea (list item de dos líneas, 72 dp):
 * [casilla] «Assignatura: acció» · texto de apoyo · etiquetas · [⋮]
 * Como en la alta fidelidad, sin punto de color: el nombre de la asignatura va en verde.
 */
@Component({
  selector: 'ap-task-row',
  imports: [Checkbox, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-row.html',
  styleUrl: './task-row.scss',
})
export class TaskRow {
  readonly subjectName = input<string | null>(null);
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
