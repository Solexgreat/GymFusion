import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password.entity';
// import { GymService } from 'src/gyms/gym.service';
// import { InstructorsService } from 'src/instructors/instructors.service';
import { Gym } from 'src/gyms/entities/gym.entity';
import { Instructor } from 'src/instructors/entities/instructor.entity';
import { GymModule } from 'src/gyms/gym.module';
import { InstructorsModule } from 'src/instructors/instructors.module';

@Module({
  imports: [
    GymModule, InstructorsModule,
    TypeOrmModule.forFeature([User, PasswordReset, Instructor]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}