import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { SchedulesService } from './schedule.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  async createSchedule(
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    return await this.schedulesService.createSchedule(createScheduleDto);
  }

  @Get()
  async getSchedules(): Promise<Schedule[]> {
    return await this.schedulesService.getSchedules();
  }

  @Put(':id')
  async updateSchedule(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    return await this.schedulesService.updateSchedule(id, updateScheduleDto);
  }

  @Delete(':id')
  async deleteSchedule(@Param('id') id: string): Promise<void> {
    return await this.schedulesService.deleteSchedule(id);
  }
}