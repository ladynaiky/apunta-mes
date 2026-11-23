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
import {
  CreateSubjectDto,
  SubjectDto,
  UpdateSubjectDto,
} from './dto/subject.dto.js';
import { SubjectsService } from './subjects.service.js';

@ApiTags('subjects')
@ApiBearerAuth()
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjects: SubjectsService) {}

  @Get()
  @DemoState()
  @ApiOperation({ summary: 'Asignaturas del usuario' })
  @ApiOkResponse({ type: [SubjectDto] })
  async list(@CurrentUser() user: AuthUser): Promise<SubjectDto[]> {
    return (await this.subjects.findByUser(user.userId)).map((s) =>
      SubjectDto.from(s),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Crear nova assignatura' })
  @ApiCreatedResponse({ type: SubjectDto })
  @ApiConflictResponse({ description: 'SUBJECT_EXISTS' })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateSubjectDto,
  ): Promise<SubjectDto> {
    return SubjectDto.from(await this.subjects.create(user.userId, dto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cambiar el nombre o el color' })
  @ApiOkResponse({ type: SubjectDto })
  @ApiConflictResponse({ description: 'SUBJECT_EXISTS' })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateSubjectDto,
  ): Promise<SubjectDto> {
    return SubjectDto.from(await this.subjects.update(user.userId, id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Borrar una asignatura sin nada apuntado' })
  @ApiNoContentResponse()
  @ApiConflictResponse({ description: 'SUBJECT_IN_USE' })
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<void> {
    return this.subjects.remove(user.userId, id);
  }
}
