import { taskLabel } from './task-title';

describe('taskLabel', () => {
  it('formatea «Assignatura: acció» como el diseño', () => {
    expect(taskLabel('Mates', 'Exercicis, pàg. 12')).toBe('Mates: exercicis, pàg. 12');
  });

  it('sin minúscula para nombres propios', () => {
    expect(taskLabel('Excursió', 'Museu de la Ciència', false)).toBe('Excursió: Museu de la Ciència');
  });

  it('sin asignatura devuelve el título tal cual', () => {
    expect(taskLabel(null, 'l’Anna')).toBe('l’Anna');
  });
});
