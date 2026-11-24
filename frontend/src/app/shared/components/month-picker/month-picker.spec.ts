import { TestBed } from '@angular/core/testing';
import { MonthPicker } from './month-picker';

describe('MonthPicker', () => {
  it('no se rompe si todavía no hay fecha (valor vacío)', async () => {
    const fixture = TestBed.createComponent(MonthPicker);
    fixture.componentRef.setInput('value', null);
    fixture.componentRef.setInput('today', '');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.title').textContent).toMatch(/\d{4}/);
  });

  it('muestra el mes del valor y marca el día elegido', async () => {
    const fixture = TestBed.createComponent(MonthPicker);
    fixture.componentRef.setInput('value', '2026-11-13');
    fixture.componentRef.setInput('today', '2026-11-04');
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.title')!.textContent).toContain('Novembre 2026');
    expect(el.querySelector('.day.selected')!.textContent!.trim()).toBe('13');
    expect(el.querySelector('.day.today')!.textContent!.trim()).toBe('4');
  });
});
