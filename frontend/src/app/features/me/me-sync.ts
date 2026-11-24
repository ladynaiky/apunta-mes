import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import { TodayService } from '../../core/data/today.service';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';

/** Sincronitzar (simulado): al principio de El meu espai · Compartir (iteración 1). */
@Component({
  selector: 'ap-me-sync',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sync" aria-live="polite">
      <p class="label">{{ t.syncStatusLabel }}</p>
      <p class="status">{{ syncText() }}</p>
      <button
        apButton
        type="button"
        variant="tonal"
        icon="sync"
        [block]="true"
        [disabled]="syncState() === 'busy'"
        [attr.aria-busy]="syncState() === 'busy'"
        (click)="sync()"
      >
        {{ syncState() === 'busy' ? t.syncing : t.syncButton }}
      </button>
    </section>
  `,
  styles: `
    :host { display: block; }
    .sync { display: flex; flex-direction: column; gap: var(--space-100); margin-bottom: var(--space-300); }
    .label { margin: var(--space-100) 0 var(--space-50); color: var(--color-on-surface-variant); font: 500 14px/20px var(--font-text); }
    .status { margin: 0 0 var(--space-100); font: 400 14px/20px var(--font-text); color: var(--color-on-surface-variant); }
  `,
})
export class MeSync implements OnInit {
  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  private readonly snackbar = inject(SnackbarService);
  protected readonly t = ca.me;

  protected readonly lastSync = signal<string | null>(null);
  protected readonly syncState = signal<'idle' | 'busy' | 'done'>('idle');
  protected readonly syncText = computed(() => {
    if (this.syncState() === 'busy') return this.t.syncingStatus;
    if (this.syncState() === 'done') return this.t.synced;
    const at = this.lastSync();
    return at ? this.t.lastSync(this.formatSync(at)) : this.t.neverSynced;
  });
  private today = '';

  async ngOnInit(): Promise<void> {
    this.today = await this.todayService.load();
    try {
      this.lastSync.set((await this.api.syncStatus()).lastSyncAt);
    } catch {
      this.lastSync.set(null);
    }
  }

  protected async sync(): Promise<void> {
    if (this.syncState() === 'busy') return;
    this.syncState.set('busy');
    try {
      const [res] = await Promise.all([this.api.sync(), new Promise((r) => setTimeout(r, 1200))]);
      this.lastSync.set(res.lastSyncAt);
      this.syncState.set('done');
    } catch (err) {
      this.syncState.set('idle');
      this.snackbar.show(toApiError(err).message);
    }
  }

  /** «avui, 8:15» (hora de Madrid) o la fecha si no es hoy. */
  private formatSync(iso: string): string {
    const d = new Date(iso);
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(d);
    const time = new Intl.DateTimeFormat('ca', { timeZone: 'Europe/Madrid', hour: 'numeric', minute: '2-digit' }).format(d);
    if (day === this.today) return `avui, ${time}`;
    const date = new Intl.DateTimeFormat('ca', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'long' }).format(d);
    return `${date}, ${time}`;
  }
}
