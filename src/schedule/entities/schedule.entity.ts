import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Class } from './../../class/entities/class.entity';
import { daysOfWeek } from 'src/enums/week.days.enum';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Class, (classEntity) => classEntity.schedules, { onDelete: 'CASCADE' })
  class: Class;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ type: 'enum', enum: daysOfWeek })
  dayOfWeek: daysOfWeek;
}