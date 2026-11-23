import { Controller, Get, Module } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { DemoState } from '../demo/demo-state.decorator.js';

export class AiMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'] }) from: 'user' | 'assistant';
  @ApiProperty() text: string;
  @ApiProperty({
    description:
      'El asistente propone apuntar algo (botones «Sí, apunta-ho» / «Ara no»)',
  })
  suggestion: boolean;
}

export class AiConversationDto {
  @ApiProperty({ type: [AiMessageDto] }) messages: AiMessageDto[];
}

/**
 * Pantalla IA: conversación fija de la alta fidelidad (no hay IA real).
 * Coordinada con los datos de demo: el examen de Mates es el 13 de novembre.
 */
const SCRIPT: AiMessageDto[] = [
  {
    from: 'user',
    text: 'Em pots ajudar amb la taula del 3?',
    suggestion: false,
  },
  {
    from: 'assistant',
    text: 'Clar que sí! Mira:\n3 × 1 = 3\n3 × 2 = 6\n3 × 3 = 9\nHas vist el truc? Cada vegada sumem 3 més.',
    suggestion: false,
  },
  { from: 'user', text: 'Quant fa 3 × 4?', suggestion: false },
  {
    from: 'assistant',
    text: 'Pensa-ho: a 9 li sumes 3 i surt 12. Molt bé!',
    suggestion: false,
  },
  {
    from: 'assistant',
    text: 'Per cert, el 13 de novembre tens examen de Mates. Vols que t’ho apunti?',
    suggestion: true,
  },
];

@ApiTags('mock: ai')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  @Get('conversation')
  @DemoState({ messages: [] })
  @ApiOperation({ summary: 'Conversa de la pantalla IA (simulada)' })
  @ApiOkResponse({ type: AiConversationDto })
  conversation(): AiConversationDto {
    return { messages: structuredClone(SCRIPT) };
  }
}

@Module({ controllers: [AiController] })
export class AiModule {}
