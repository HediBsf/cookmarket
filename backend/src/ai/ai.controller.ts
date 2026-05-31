import { Body, Controller, ForbiddenException, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthRequest } from '../auth/auth-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly service: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  chat(@Body() body: { message?: string }, @Req() req: AuthRequest) {
    if (req.user.role !== Role.CLIENT) {
      throw new ForbiddenException('Espace client requis');
    }

    return this.service.chat(body.message ?? '');
  }
}
