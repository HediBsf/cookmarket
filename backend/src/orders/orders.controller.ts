import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { AuthRequest } from '../auth/auth-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMine(@Req() req: AuthRequest) {
    return this.service.findByClient(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('seller/:sellerId')
  findBySeller(@Param('sellerId') sellerId: string, @Req() req: AuthRequest) {
    return this.service.findBySeller(req.user.id || Number(sellerId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Req() req: AuthRequest) {
    return this.service.create(body, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { status: OrderStatus }, @Req() req: AuthRequest) {
    return this.service.updateStatus(Number(id), body.status, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/seller-paid')
  markSellerPaid(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.markSellerPaid(Number(id), req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/confirm-d17')
  confirmD17Payment(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.confirmD17Payment(Number(id), req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
