import { Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { notFound } from './errors.js';

/** Un id con formato incorrecto se trata como «no existe» (404). */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isValidObjectId(value)) throw notFound();
    return value;
  }
}
