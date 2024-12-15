import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Schedule } from './../../schedule/entities/schedule.entity';
import { Instructor } from 'src/instructors/entities/instructor.entity';
import { Gym } from 'src/gyms/entities/gym.entity';

@Entity()
export class Class {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => Gym, (gym) => gym.classes, { nullable: true })
    gym: Gym;

    @ManyToOne(() => Instructor, (instructor) => instructor.assignedClass)
    instructor: Instructor;

    @OneToMany(() => Schedule, (schedule) => schedule.class)
    schedules: Schedule[];
}