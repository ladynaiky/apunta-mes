import { ConflictException, NotFoundException } from '@nestjs/common';

export const notFound = () =>
  new NotFoundException({ statusCode: 404, code: 'NOT_FOUND' });

export const conflict = (code: string) =>
  new ConflictException({ statusCode: 409, code });
