import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassService } from 'src/class/class.service';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,

    private classService: ClassService,
  ) {}

  async createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const { classId } = createScheduleDto;

    const cls = await this.classService.findOneClassbyId(classId)

    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      class: cls
    });
    return await this.scheduleRepository.save(schedule);
  }

  async updateSchedule(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    await this.scheduleRepository.update(id, updateScheduleDto);
    return await this.scheduleRepository.findOneBy({ id });
  }

  async getSchedules(): Promise<Schedule[]> {
    return await this.scheduleRepository.find({ relations: ['class'] });
  }

  async deleteSchedule(id: string): Promise<void> {
    await this.scheduleRepository.delete(id);
  }
}