import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '../auth/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import { DemoState } from '../demo/demo-state.decorator.js';
import { CreateTagDto, TagDto, UpdateTagDto } from './dto/tag.dto.js';
import { TagsService } from './tags.service.js';

@ApiTags('tags')
@ApiBearerAuth()
@Controller('tags')
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  @Get()
  @DemoState()
  @ApiOperation({ summary: 'Etiquetes pròpies de l’usuari' })
  @ApiOkResponse({ type: [TagDto] })
  async list(@CurrentUser() user: AuthUser): Promise<TagDto[]> {
    return (await this.tags.findByUser(user.userId)).map((t) => TagDto.from(t));
  }

  @Post()
  @ApiOperation({ summary: 'Nova etiqueta' })
  @ApiCreatedResponse({ type: TagDto })
  @ApiConflictResponse({ description: 'TAG_EXISTS' })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateTagDto,
  ): Promise<TagDto> {
    return TagDto.from(await this.tags.create(user.userId, dto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Canviar el nom, el color o si es mostra' })
  @ApiOkResponse({ type: TagDto })
  @ApiConflictResponse({ description: 'TAG_EXISTS' })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateTagDto,
  ): Promise<TagDto> {
    return TagDto.from(await this.tags.update(user.userId, id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Esborrar una etiqueta (es treu de les tasques)' })
  @ApiNoContentResponse()
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<void> {
    return this.tags.remove(user.userId, id);
  }
}
