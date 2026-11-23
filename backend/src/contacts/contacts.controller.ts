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
  ContactDto,
  CreateContactDto,
  UpdateContactDto,
} from './contacts.dto.js';
import { ContactsService } from './contacts.service.js';

@ApiTags('mock: contacts')
@ApiBearerAuth()
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contacts: ContactsService) {}

  @Get()
  @DemoState()
  @ApiOperation({ summary: 'Contactes' })
  @ApiOkResponse({ type: [ContactDto] })
  async list(@CurrentUser() user: AuthUser): Promise<ContactDto[]> {
    return (await this.contacts.list(user.userId)).map((c) =>
      ContactDto.from(c),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Afegir contacte' })
  @ApiCreatedResponse({ type: ContactDto })
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateContactDto) {
    return ContactDto.from(await this.contacts.create(user.userId, dto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar contacte' })
  @ApiOkResponse({ type: ContactDto })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return ContactDto.from(await this.contacts.update(user.userId, id, dto));
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Esborrar contacte' })
  @ApiNoContentResponse()
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.contacts.remove(user.userId, id);
  }
}
