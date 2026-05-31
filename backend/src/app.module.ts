import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DishesModule } from './dishes/dishes.module';
import { RecipesModule } from './recipes/recipes.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FormationsModule } from './formations/formations.module';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    DishesModule,
    RecipesModule,
    OrdersModule,
    ReviewsModule,
    FormationsModule,
    AdminModule,
    AiModule,
    NotificationsModule,
  ],
})
export class AppModule {}
