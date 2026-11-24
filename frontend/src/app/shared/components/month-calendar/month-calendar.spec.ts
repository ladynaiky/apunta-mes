import { TestBed } from '@angular/core/testing';
import { MonthCalendar } from './month-calendar';

describe('MonthCalendar', () => {
  it('novembre de 2026 empieza en diumenge y marca hoy y los puntos', async () => {
    const fixture = TestBed.createComponent(MonthCalendar);
    fixture.componentRef.setInput('month', '2026-11');
    fixture.componentRef.setInput('today', '2026-11-04');
    fixture.componentRef.setInput('selected', '2026-11-04');
    fixture.componentRef.setInput('label', 'Novembre 2026');
    fixture.componentRef.setInput('ariaLabel', (d: string, n: number) => `${d}:${n}`);
    fixture.componentRef.setInput('dots', {
      '2026-11-04': [
        { type: 'task', subjectName: 'Mates', colorToken: 'blau', colorHex: '#1F4FB8' },
        { type: 'task', subjectName: 'Català', colorToken: 'groc', colorHex: '#B08800' },
      ],
    });
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const firstRow = el.querySelectorAll('.row')[1];
    // 6 huecos (dl a ds) y el 1 en diumenge.
    expect(firstRow.querySelectorAll('.cell.empty').length).toBe(6);
    expect(el.querySelectorAll('button.cell').length).toBe(30);
    expect(el.querySelector('.day.selected')!.textContent!.trim()).toBe('4');
    expect(el.querySelector('[aria-label="2026-11-04:2"]')).not.toBeNull();
  });
});
