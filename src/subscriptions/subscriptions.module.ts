import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from './entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { Gym } from 'src/gyms/entities/gym.entity';
import { UserService } from 'src/user/user.service';
import { GymService } from 'src/gyms/gym.service';
import { UserModule } from 'src/user/user.module';
import { GymModule } from 'src/gyms/gym.module';

@Module({
  imports: [
    UserModule, GymModule,
    TypeOrmModule.forFeature([Subscription, User, Gym]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}