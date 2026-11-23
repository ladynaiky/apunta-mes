import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsIn, IsOptional } from 'class-validator';
import { GROUP_BY, MARK_WITH, TAGS } from './preferences.schema.js';

export class PreferencesDto {
  @ApiProperty({ enum: GROUP_BY }) groupBy: (typeof GROUP_BY)[number];
  @ApiProperty({ enum: MARK_WITH }) markWith: (typeof MARK_WITH)[number];
  @ApiProperty({ enum: TAGS, isArray: true })
  visibleTags: (typeof TAGS)[number][];
}

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ enum: GROUP_BY })
  @IsOptional()
  @IsIn(GROUP_BY, { message: 'groupBy.invalid' })
  groupBy?: (typeof GROUP_BY)[number];

  @ApiPropertyOptional({ enum: MARK_WITH })
  @IsOptional()
  @IsIn(MARK_WITH, { message: 'markWith.invalid' })
  markWith?: (typeof MARK_WITH)[number];

  @ApiPropertyOptional({ enum: TAGS, isArray: true })
  @IsOptional()
  @IsIn(TAGS, { each: true, message: 'visibleTags.invalid' })
  @ArrayUnique({ message: 'visibleTags.invalid' })
  @IsArray({ message: 'visibleTags.invalid' })
  visibleTags?: (typeof TAGS)[number][];
}

export class SyncStatusDto {
  @ApiProperty({ nullable: true, description: 'Última sincronització' })
  lastSyncAt: Date | null;
}
