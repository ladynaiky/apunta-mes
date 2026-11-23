import { taskLabel } from './task-title';

describe('taskLabel', () => {
  it('formatea «Assignatura: acció» como el diseño', () => {
    expect(taskLabel('Mates', 'Exercicis, pàg. 12')).toBe('Mates: exercicis, pàg. 12');
  });

  it('sin asignatura devuelve el título tal cual', () => {
    expect(taskLabel(null, 'l’Anna')).toBe('l’Anna');
  });
});
