import { Module } from '@nestjs/common';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from './entities/gym.entity';
import { User } from 'src/user/entities/user.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Instructor } from 'src/instructors/entities/instructor.entity';
import { Class } from 'src/class/entities/class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gym, User, Subscription, Instructor, Class]),
  ],
  controllers: [GymController],
  providers: [GymService],
})
export class GymModule {}