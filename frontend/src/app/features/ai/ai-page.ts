import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import { ApiService } from '../../core/data/api.service';
import type { AiMessage } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Icon } from '../../shared/components/icon/icon';
import { Progress } from '../../shared/components/progress/progress';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TopBar } from '../../shared/components/top-bar/top-bar';

/**
 * IA (simulada): conversación de la alta fidelidad. Las preguntas nuevas se
 * añaden a la conversación y reciben siempre la respuesta de demostración.
 */
@Component({
  selector: 'ap-ai-page',
  imports: [FormsModule, IonContent, Button, Icon, Progress, StateMessage, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ai-page.html',
  styleUrl: './ai-page.scss',
})
export class AiPage implements ViewWillEnter {
  private readonly api = inject(ApiService);
  private readonly nav = inject(NavController);
  protected readonly store = inject(TasksStore);
  protected readonly t = ca.ai;
  protected readonly ca = ca;

  private readonly content = viewChild(IonContent);
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('questionInput');

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly messages = signal<AiMessage[]>([]);
  protected readonly question = signal('');
  /** «Ara no» oculta los botones de la sugerencia. */
  protected readonly suggestionDismissed = signal(false);

  ionViewWillEnter(): void {
    if (this.status() !== 'ready') void this.load();
    if (this.store.status() === 'idle') void this.store.load();
  }

  protected async load(): Promise<void> {
    this.status.set('loading');
    try {
      this.messages.set((await this.api.aiConversation()).messages);
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  protected send(): void {
    const text = this.question().trim();
    if (!text) return;
    this.messages.update((m) => [
      ...m,
      { from: 'user', text, suggestion: false },
      { from: 'assistant', text: this.t.demoReply, suggestion: false },
    ]);
    this.question.set('');
    setTimeout(() => void this.content()?.scrollToBottom(300));
    this.input()?.nativeElement.focus();
  }

  /** «Sí, apunta-ho»: Apuntar examen (fase 6) con la fecha del examen sugerido. */
  protected acceptSuggestion(): void {
    void this.nav.navigateForward('/new/exam', { queryParams: { from: 'ai', date: '2026-11-13' } });
  }
}
