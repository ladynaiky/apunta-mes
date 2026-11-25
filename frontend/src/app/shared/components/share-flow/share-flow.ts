import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TasksStore } from '../../../core/data/tasks.store';
import { ShareForm } from '../../../features/share/share-form';
import { ca } from '../../../i18n/ca';
import { dueLabel } from '../../utils/dates-ca';
import { rowTitle } from '../../utils/task-title';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { Modal } from '../modal/modal';
import { SnackbarService } from '../snackbar/snackbar.service';
import { TaskRow } from '../task-row/task-row';
import { ShareFlowService } from './share-flow.service';

/** Modal centrado del flujo de crear y compartir (un paso cada vez, con la X arriba a la derecha). */
@Component({
  selector: 'ap-share-flow',
  imports: [Button, Icon, Modal, ShareForm, TaskRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-modal [open]="flow.step() !== null" [headline]="headline()" (closed)="flow.close()">
      @switch (flow.step()) {
        @case ('created') {
          @if (flow.entry(); as e) {
            <section class="done">
              <ap-icon name="check_circle" [size]="48" />
              <p>{{ c.text }}</p>
            </section>
            <ap-task-row
              [subjectName]="e.subject?.name ?? (e.type === 'trip' ? ca.sheet.kind['trip'] : null)"
              [subjectColor]="e.subject?.colorToken ?? null"
              [title]="rowTitle(e)"
              [supporting]="due()"
              [highPriority]="e.priority === 'high'"
              [lowPriority]="e.priority === 'low'"
              [showCheckbox]="false"
              [showMenu]="false"
              [lowercaseTitle]="!!e.subject"
            />
            <h3 class="question">{{ c.share }}</h3>
            <div class="pair">
              <button apButton type="button" variant="outlined" size="m" (click)="flow.close()">{{ c.no }}</button>
              <button apButton type="button" variant="filled" size="m" [attr.aria-label]="c.yesLabel" (click)="flow.share()">{{ c.yes }}</button>
            </div>
          }
        }
        @case ('share') {
          <ap-share-form (generated)="flow.linkReady($event)" />
        }
        @case ('link') {
          <p class="text">{{ s.linkText }}</p>
          <div class="link-field" [attr.aria-label]="s.linkLabel" role="textbox" aria-readonly="true">
            <span class="float-label">{{ s.link }}</span>{{ flow.url() }}
          </div>
          <button apButton type="button" variant="filled" size="m" icon="content_copy" [block]="true" [disabled]="copying()" (click)="copy()">
            {{ s.copy }}
          </button>
        }
        @case ('copied') {
          <section class="done">
            <ap-icon name="check_circle" [size]="48" />
            <h3>{{ s.copied }}</h3>
            <p>{{ s.copiedText }}</p>
          </section>
          <div class="link-field" [attr.aria-label]="s.linkLabel" role="textbox" aria-readonly="true">
            <span class="float-label">{{ s.link }}</span>{{ flow.url() }}
          </div>
          <button apButton type="button" variant="filled" size="m" [block]="true" (click)="flow.close()">{{ s.done }}</button>
        }
      }
    </ap-modal>
  `,
  styles: `
    .done { display: flex; flex-direction: column; align-items: center; gap: var(--space-100); text-align: center; }
    .done ap-icon { color: var(--color-primary-container); }
    .done h3 { margin: 0; font: 600 22px/28px var(--font-title); }
    .done p { margin: 0; color: var(--color-on-surface-variant); font: 400 14px/20px var(--font-text); }
    .question { margin: var(--space-100) 0 0; font: 600 16px/24px var(--font-title); }
    .pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-150); }
    .text { margin: 0; font: 400 16px/24px var(--font-text); letter-spacing: 0.5px; }
    .link-field {
      position: relative; display: flex; align-items: center;
      box-sizing: border-box; min-height: var(--size-text-field); padding: var(--space-100) 15px;
      border: 1px solid var(--color-outline); border-radius: var(--shape-corner-extra-small);
      font: 400 16px/24px var(--font-text); overflow-wrap: anywhere; user-select: all;
    }
    .float-label { position: absolute; top: -9px; left: 12px; padding: 0 4px; background: var(--color-surface-container-low); color: var(--color-on-surface-variant); font: 400 12px/16px var(--font-text); }
  `,
})
export class ShareFlow {
  protected readonly flow = inject(ShareFlowService);
  private readonly store = inject(TasksStore);
  private readonly snackbar = inject(SnackbarService);
  protected readonly ca = ca;
  protected readonly c = ca.created;
  protected readonly s = ca.share;
  protected readonly rowTitle = rowTitle;
  protected readonly copying = signal(false);

  protected readonly headline = computed(() => {
    switch (this.flow.step()) {
      case 'created': return this.c.titles[this.flow.entry()?.type ?? 'task'];
      case 'share': return this.s.title;
      case 'link': return this.s.linkTitle;
      case 'copied': return this.s.copiedTitle;
      default: return '';
    }
  });
  protected readonly due = computed(() => {
    const e = this.flow.entry();
    return e ? dueLabel(e.date, this.store.today()) : '';
  });

  protected async copy(): Promise<void> {
    this.copying.set(true);
    try {
      await navigator.clipboard.writeText(this.flow.url());
      this.flow.copied();
    } catch {
      // Sin permiso de portapapeles: el enlace sigue a la vista para copiarlo a mano.
      this.snackbar.show(this.s.copyFailed);
    } finally {
      this.copying.set(false);
    }
  }
}
