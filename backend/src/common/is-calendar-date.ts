import { registerDecorator, ValidationOptions } from 'class-validator';
import { isRealDate } from './dates.js';

/** AAAA-MM-DD y que la fecha exista. */
export function IsCalendarDate(options?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      name: 'isCalendarDate',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate: (v: unknown) => typeof v === 'string' && isRealDate(v),
      },
    });
}
