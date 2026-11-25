import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import type { Tag, TagKey } from '../../../core/data/models';
import { TasksStore } from '../../../core/data/tasks.store';
import { ca } from '../../../i18n/ca';
import { taskLabel, type SubjectColorToken } from '../../utils/task-title';
import { Checkbox } from '../checkbox/checkbox';
import { Icon } from '../icon/icon';
import { IconButton } from '../icon-button/icon-button';

/**
 * Fila de tarea (list item de dos líneas, 72 dp):
 * [casilla] «Assignatura: acció» · texto de apoyo · etiquetas · [⋮]
 * Sin punto de color: el nombre de la asignatura va del color de la asignatura (iteración 1).
 */
@Component({
  selector: 'ap-task-row',
  imports: [Checkbox, Icon, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-row.html',
  styleUrl: './task-row.scss',
})
export class TaskRow {
  readonly subjectName = input<string | null>(null);
  /** Tipo de entrada: las excursiones se muestran como «Excursió: …» (su asignatura es «Excursions»). */
  readonly entryType = input<string | null>(null);
  /** Color de la asignatura (token): el nombre va de ese color. */
  readonly subjectColor = input<SubjectColorToken | null>(null);
  readonly title = input.required<string>();
  /** «Per a avui», «Per al 12 de novembre»… */
  readonly supporting = input<string | null>(null);
  readonly done = input(false);
  readonly highPriority = input(false);
  readonly lowPriority = input(false);
  /** Etiquetas propias de la tarea (solo se ven las marcadas como «mostrar»). */
  readonly tags = input<Tag[]>([]);
  readonly showCheckbox = input(true);
  /** Icono en el lugar de la casilla (aniversarios: «cake»). */
  readonly leadIcon = input<string | null>(null);
  readonly showMenu = input(true);
  readonly showTags = input(true);
  /** «Mates: exercicis» (tareas) · «Excursió: Museu de la Ciència» (nombres propios). */
  readonly lowercaseTitle = input(true);

  readonly doneChange = output<boolean>();
  readonly open = output<void>();
  readonly menu = output<void>();

  protected readonly t = ca.task;
  private readonly store = inject(TasksStore);
  /** Etiquetas visibles según Personalitzar. */
  protected readonly userTags = computed(() => this.tags().filter((t) => t.visible));
  protected tagOn(key: TagKey): boolean {
    return this.store.visibleTags().includes(key);
  }
  protected readonly shownSubject = computed(() =>
    this.entryType() === 'trip' ? ca.sheet.kind['trip'] : this.subjectName(),
  );
  protected readonly label = computed(() =>
    taskLabel(this.shownSubject(), this.title(), this.lowercaseTitle() && this.entryType() !== 'trip'),
  );
  protected readonly checkLabel = computed(() =>
    this.done() ? this.t.unmarkDone(this.label()) : this.t.markDone(this.label()),
  );
}
