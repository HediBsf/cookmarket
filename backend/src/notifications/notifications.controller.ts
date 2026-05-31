import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthRequest } from '../auth/auth-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('me')
  findMine(@Req() req: AuthRequest) {
    return this.service.findBySeller(req.user.id);
  }

  @Get('client/me')
  findMyClientNotifications(@Req() req: AuthRequest) {
    return this.service.findByClient(req.user.id);
  }

  @Get('me/unread-count')
  unreadCount(@Req() req: AuthRequest) {
    return this.service.unreadCount(req.user.id);
  }

  @Get('client/me/unread-count')
  clientUnreadCount(@Req() req: AuthRequest) {
    return this.service.clientUnreadCount(req.user.id);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.markRead(Number(id), req.user.id);
  }

  @Patch('client/:id/read')
  markClientRead(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.markClientRead(Number(id), req.user.id);
  }

  @Patch('client/:id/unread')
  markClientUnread(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.markClientUnread(Number(id), req.user.id);
  }

  @Delete('client/:id')
  deleteClientNotification(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.deleteClientNotification(Number(id), req.user.id);
  }
}
