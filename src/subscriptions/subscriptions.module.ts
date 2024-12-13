import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from './entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { Gym } from 'src/gyms/entities/gym.entity';
import { UserService } from 'src/user/user.service';
import { GymService } from 'src/gyms/gym.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, User, Gym]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, UserService, GymService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}