import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { daysOfWeek } from "src/enums/week.days.enum";

export class CreateScheduleDto {
    @IsString()
    classId: string;

    @IsDate()
    startTime: Date;

    @IsDate()
    endTime: Date;

    @IsEnum(daysOfWeek)
    dayOfWeek: daysOfWeek;
  }