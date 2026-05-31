import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FormationsController } from './formations.controller';
import { FormationsService } from './formations.service';

@Module({
  imports: [AuthModule],
  controllers: [FormationsController],
  providers: [FormationsService],
})
export class FormationsModule {}
