import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthRequest } from '../auth/auth-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FormationsService } from './formations.service';

@Controller('formations')
export class FormationsController {
  constructor(private readonly service: FormationsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('seller/:sellerId')
  findBySeller(@Param('sellerId') sellerId: string) {
    return this.service.findBySeller(Number(sellerId));
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
  update(@Param('id') id: string, @Body() body: any, @Req() req: AuthRequest) {
    return this.service.update(Number(id), body, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.service.remove(Number(id), req.user.id);
  }
}
