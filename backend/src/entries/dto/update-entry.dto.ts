import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEntryDto } from './create-entry.dto.js';

/** Edición: todo opcional; el tipo no se puede cambiar. */
export class UpdateEntryDto extends PartialType(
  OmitType(CreateEntryDto, ['type'] as const),
) {}
