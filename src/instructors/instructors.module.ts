import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructorsService } from './instructors.service';
import { InstructorsController } from './instructors.controller';
import { Instructor } from './entities/instructor.entity';
import { User } from 'src/user/entities/user.entity';
import { Gym } from 'src/gyms/entities/gym.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    // UserModule,
    TypeOrmModule.forFeature([Instructor, User, Gym]),
  ],
  controllers: [InstructorsController],
  providers: [InstructorsService],
  exports: [InstructorsService],
})
export class InstructorsModule {}