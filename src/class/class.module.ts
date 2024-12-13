import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { Class } from './entities/class.entity';
import { Gym } from 'src/gyms/entities/gym.entity';
import { Instructor } from 'src/instructors/entities/instructor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Gym, Instructor])],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
