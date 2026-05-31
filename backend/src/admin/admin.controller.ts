import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthRequest } from '../auth/auth-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  private ensureAdmin(req: AuthRequest) {
    if (req.user.role !== Role.ADMIN) {
      throw new ForbiddenException('Acces admin requis');
    }
  }

  @Get('overview')
  overview(@Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.overview();
  }

  @Get('users')
  users(@Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.users();
  }

  @Get('orders')
  orders(@Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.orders();
  }

  @Get('dishes')
  dishes(@Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.dishes();
  }

  @Get('formations')
  formations(@Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.formations();
  }

  @Get('support')
  supportTickets(@Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.supportTickets();
  }

  @Patch('support/:id/reply')
  replySupportTicket(@Param('id') id: string, @Body() body: { reply: string }, @Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.replySupportTicket(Number(id), req.user.id, body.reply);
  }

  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body() body: { role: Role }, @Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.updateUserRole(Number(id), body.role);
  }

  @Patch('users/:id/verify')
  verifyUser(@Param('id') id: string, @Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.verifyUser(Number(id));
  }

  @Patch('users/:id/confirm-seller-subscription')
  confirmSellerSubscription(@Param('id') id: string, @Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.confirmSellerSubscription(Number(id));
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string, @Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.deleteUser(Number(id));
  }

  @Delete('orders/:id')
  deleteOrder(@Param('id') id: string, @Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.deleteOrder(Number(id));
  }

  @Delete('dishes/:id')
  deleteDish(@Param('id') id: string, @Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.deleteDish(Number(id));
  }

  @Delete('formations/:id')
  deleteFormation(@Param('id') id: string, @Req() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.deleteFormation(Number(id));
  }
}
