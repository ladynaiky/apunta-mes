import { Location, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import type { CheckItem, EntryInput, EntryType } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { TodayService } from '../../core/data/today.service';
import { apiErrors, ca } from '../../i18n/ca';
import { BottomSheet } from '../../shared/components/bottom-sheet/bottom-sheet';
import { Button } from '../../shared/components/button/button';
import { Chip } from '../../shared/components/chip/chip';
import { Dialog } from '../../shared/components/dialog/dialog';
import { Icon } from '../../shared/components/icon/icon';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { MonthPicker } from '../../shared/components/month-picker/month-picker';
import { Select, type SelectOption } from '../../shared/components/select/select';
import { TextField } from '../../shared/components/text-field/text-field';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { shortDate } from '../../shared/utils/dates-ca';

const TYPES: EntryType[] = ['task', 'exam', 'trip', 'birthday'];
const ICONS: Record<EntryType, string> = { task: 'assignment', exam: 'lightbulb', trip: 'landscape', birthday: 'cake' };
/** Opciones de «Avisa’m abans» por tipo y la elegida por defecto (diseño). */
const REMINDER_OPTIONS: Record<EntryType, { options: number[]; default: number }> = {
  task: { options: [0, 1, 2], default: 1 },
  exam: { options: [1, 3, 7], default: 3 },
  trip: { options: [1, 3, 7], default: 1 },
  birthday: { options: [0, 1, 7], default: 1 },
};

/**
 * Apuntar (tasca, examen, excursió o aniversari): una sola pantalla con
 * pestañas por tipo. `?from=` indica el origen y `?date=` la fecha (calendario).
 */
@Component({
  selector: 'ap-new-entry-page',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    RouterLink,
    IonContent,
    BottomSheet,
    Button,
    Chip,
    Dialog,
    Icon,
    IconButton,
    MonthPicker,
    Select,
    TextField,
    TopBar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-entry-page.html',
  styleUrl: './new-entry-page.scss',
})
export class NewEntryPage implements OnInit, ViewWillEnter {
  /** Parámetros de la ruta y de la URL. */
  readonly typeParam = input<string>('task', { alias: 'type' });
  readonly from = input<string | undefined>();
  readonly dateParam = input<string | undefined>(undefined, { alias: 'date' });

  private readonly api = inject(ApiService);
  private readonly store = inject(TasksStore);
  private readonly todayService = inject(TodayService);
  private readonly nav = inject(NavController);
  private readonly location = inject(Location);
  protected readonly t = ca.newEntry;
  protected readonly ca = ca;
  protected readonly types = TYPES;
  protected readonly icons = ICONS;

  protected readonly type = signal<EntryType>('task');
  protected readonly today = signal('');

  // Campos (los comunes se conservan al cambiar de pestaña)
  protected readonly subjectId = signal<string | null>(null);
  protected readonly title = signal('');
  protected readonly date = signal<string | null>(null);
  protected readonly page = signal('');
  protected readonly activity = signal('');
  protected readonly notes = signal('');
  protected readonly topic = signal('');
  protected readonly examType = signal<'written' | 'oral' | 'project'>('written');
  protected readonly toStudy = signal('');
  protected readonly departureTime = signal('09:00');
  protected readonly returnTime = signal('17:00');
  protected readonly bring = signal<CheckItem[]>([]);
  protected readonly bringDraft = signal('');
  protected readonly editingItem = signal<number | null>(null);
  protected readonly editingDraft = signal('');
  protected readonly personName = signal('');
  protected readonly age = signal('');
  protected readonly relation = signal<'friend' | 'family' | 'class'>('friend');

  // Avís
  protected readonly reminderDays = signal(REMINDER_OPTIONS.task.default);
  protected readonly reminderTime = signal('08:00');
  protected readonly reminderOpen = signal(false);
  private reminderTouched = false;

  // Tria el dia
  protected readonly dayPickerOpen = signal(false);
  protected readonly pendingDay = signal<string | null>(null);

  protected readonly tried = signal(false);
  protected readonly sending = signal(false);
  protected readonly serverErrors = signal<Record<string, string>>({});
  protected readonly formError = signal<string | null>(null);

  protected readonly subjectOptions = computed<SelectOption<string>[]>(() =>
    this.store.subjects().map((s) => ({ value: s.id, label: s.name, color: s.colorToken })),
  );
  protected readonly reminderOptions = computed(() => REMINDER_OPTIONS[this.type()].options);
  protected readonly reminderSummary = computed(
    () => `${this.reminderText(this.reminderDays())} · ${this.reminderTime()}`,
  );
  protected readonly dateText = computed(() => {
    const d = this.date();
    return d ? shortDate(d) : null;
  });

  /** Errores del cliente (mismos códigos que la API) + errores de la API. */
  protected readonly errors = computed<Record<string, string>>(() => {
    const e: Record<string, string> = { ...this.serverErrors() };
    if (!this.tried()) return e;
    const type = this.type();
    if ((type === 'task' || type === 'exam') && !this.subjectId()) e['subject'] ??= apiErrors['subject.required'];
    if ((type === 'task' || type === 'trip') && !this.title().trim()) e['title'] ??= apiErrors['title.required'];
    if (type === 'birthday' && !this.personName().trim()) e['personName'] ??= apiErrors['personName.required'];
    if (!this.date()) e['date'] ??= apiErrors['date.required'];
    return e;
  });

  async ngOnInit(): Promise<void> {
    const type = TYPES.includes(this.typeParam() as EntryType) ? (this.typeParam() as EntryType) : 'task';
    this.type.set(type);
    this.reminderDays.set(REMINDER_OPTIONS[type].default);
    this.today.set(await this.todayService.load());
    if (this.dateParam()) this.date.set(this.dateParam()!);
  }

  ionViewWillEnter(): void {
    void this.store.load().then(() => {
      // Al volver de «Crear nova assignatura», queda elegida.
      const created = this.store.lastCreatedSubjectId();
      if (created) {
        this.subjectId.set(created);
        this.store.lastCreatedSubjectId.set(null);
      }
    });
  }

  protected setType(type: EntryType): void {
    this.type.set(type);
    if (!this.reminderTouched) this.reminderDays.set(REMINDER_OPTIONS[type].default);
    this.tried.set(false);
    this.serverErrors.set({});
    this.formError.set(null);
    // La URL sigue al tipo (sin crear una pantalla nueva en el historial).
    const query = this.location.path().split('?')[1];
    this.location.replaceState(`/new/${type}`, query);
  }

  protected reminderText(days: number): string {
    return ca.sheet.reminder(days, '').replace(' · ', '');
  }

  protected chooseReminder(days: number): void {
    this.reminderDays.set(days);
    this.reminderTouched = true;
  }

  protected openDayPicker(): void {
    this.pendingDay.set(this.date() ?? this.today());
    this.dayPickerOpen.set(true);
  }

  protected confirmDay(): void {
    this.date.set(this.pendingDay());
    this.dayPickerOpen.set(false);
    this.clearError('date');
  }

  protected addItem(): void {
    const name = this.bringDraft().trim();
    if (!name) return;
    this.bring.update((l) => [...l, { name, done: false }]);
    this.bringDraft.set('');
  }

  protected startEditItem(i: number): void {
    this.editingItem.set(i);
    this.editingDraft.set(this.bring()[i].name);
  }

  protected saveItem(i: number): void {
    const name = this.editingDraft().trim();
    this.bring.update((l) => (name ? l.map((it, j) => (j === i ? { ...it, name } : it)) : l.filter((_, j) => j !== i)));
    this.editingItem.set(null);
  }

  protected removeItem(i: number): void {
    this.bring.update((l) => l.filter((_, j) => j !== i));
  }

  protected clearError(field: string): void {
    if (this.serverErrors()[field]) {
      const next = { ...this.serverErrors() };
      delete next[field];
      this.serverErrors.set(next);
    }
  }

  protected cancel(): void {
    void this.nav.back();
  }

  protected async submit(): Promise<void> {
    this.tried.set(true);
    this.formError.set(null);
    if (Object.keys(this.errors()).length || this.sending()) return;

    const type = this.type();
    const data: EntryInput = {
      type,
      date: this.date()!,
      reminder: { daysBefore: this.reminderDays(), time: this.reminderTime() },
    };
    if (type === 'task') {
      Object.assign(data, {
        subject: this.subjectId(),
        title: this.title().trim(),
        page: this.page().trim(),
        activity: this.activity().trim(),
        notes: this.notes(),
      });
    } else if (type === 'exam') {
      Object.assign(data, {
        subject: this.subjectId(),
        topic: this.topic().trim(),
        examType: this.examType(),
        toStudy: this.toStudy(),
      });
    } else if (type === 'trip') {
      Object.assign(data, {
        title: this.title().trim(),
        departureTime: this.departureTime(),
        returnTime: this.returnTime(),
        whatToBring: this.bring(),
        notes: this.notes(),
      });
    } else {
      const age = parseInt(this.age(), 10);
      Object.assign(data, {
        personName: this.personName().trim(),
        age: Number.isFinite(age) ? age : null,
        relation: this.relation(),
        giftIdeas: this.notes(),
      });
    }

    this.sending.set(true);
    try {
      const created = await this.api.createEntry(data);
      void this.store.load();
      await this.nav.navigateForward(['/new', type, 'done', created.id], {
        queryParams: { from: this.from() ?? 'home' },
        replaceUrl: true,
      });
    } catch (err) {
      const e = toApiError(err);
      this.serverErrors.set(e.fields);
      if (e.code !== 'VALIDATION_ERROR') this.formError.set(e.message);
    } finally {
      this.sending.set(false);
    }
  }
}
