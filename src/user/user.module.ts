import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { GymService } from 'src/gyms/gym.service';
import { InstructorsService } from 'src/instructors/instructors.service';
import { Gym } from 'src/gyms/entities/gym.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordReset, Subscription, Gym]),
  ],
  controllers: [UserController],
  providers: [UserService, GymService, InstructorsService],
  exports: [UserService],
})
export class UserModule {}