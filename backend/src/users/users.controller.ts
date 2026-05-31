import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthRequest } from '../auth/auth-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthRequest) {
    return this.service.me(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Body() body: any, @Req() req: AuthRequest) {
    return this.service.updateMe(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/seller-subscription')
  sellerSubscription(@Req() req: AuthRequest) {
    return this.service.sellerSubscription(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/seller-subscription')
  submitSellerSubscriptionPayment(@Body() body: any, @Req() req: AuthRequest) {
    return this.service.submitSellerSubscriptionPayment(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/support')
  contactSupport(@Body() body: any, @Req() req: AuthRequest) {
    return this.service.contactSupport(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/support')
  mySupportTickets(@Req() req: AuthRequest) {
    return this.service.mySupportTickets(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
