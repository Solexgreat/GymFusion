import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesService } from './schedule.service';
import { SchedulesController } from './schedule.controller';
import { ClassModule } from './../class/class.module';
import { Schedule } from './entities/schedule.entity';
import { ClassService } from 'src/class/class.service';

@Module({
  imports: [
    ClassModule,
    TypeOrmModule.forFeature([Schedule]),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class ScheduleModule {}