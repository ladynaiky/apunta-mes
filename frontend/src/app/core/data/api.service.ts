import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AiMessage,
  AppConfig,
  CalendarDay,
  Entry,
  EntryInput,
  ReminderEntry,
  Subject,
} from './models';

/** Llamadas a la API de Apunta+ (todas devuelven promesas). */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiUrl;

  private get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let httpParams = new HttpParams();
    for (const [k, v] of Object.entries(params ?? {})) {
      if (v !== undefined) httpParams = httpParams.set(k, String(v));
    }
    return firstValueFrom(this.http.get<T>(`${this.url}${path}`, { params: httpParams }));
  }

  config(): Promise<AppConfig> {
    return this.get('/config');
  }

  subjects(): Promise<Subject[]> {
    return this.get('/subjects');
  }

  today(): Promise<Entry[]> {
    return this.get('/entries/today');
  }

  week(): Promise<Entry[]> {
    return this.get('/entries/week');
  }

  day(date: string): Promise<Entry[]> {
    return this.get(`/entries/day/${date}`);
  }

  calendar(month: string): Promise<CalendarDay[]> {
    return this.get('/calendar', { month });
  }

  reminders(): Promise<ReminderEntry[]> {
    return this.get('/reminders');
  }

  aiConversation(): Promise<{ messages: AiMessage[] }> {
    return this.get('/ai/conversation');
  }

  createEntry(data: EntryInput): Promise<Entry> {
    return firstValueFrom(this.http.post<Entry>(`${this.url}/entries`, data));
  }

  updateEntry(id: string, data: EntryInput): Promise<Entry> {
    return firstValueFrom(this.http.patch<Entry>(`${this.url}/entries/${id}`, data));
  }

  setDone(id: string, done: boolean): Promise<Entry> {
    return firstValueFrom(this.http.patch<Entry>(`${this.url}/entries/${id}/done`, { done }));
  }

  deleteEntry(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url}/entries/${id}`));
  }
}
