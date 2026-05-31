import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishesModule {}
