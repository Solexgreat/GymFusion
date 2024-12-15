import { Class } from "src/class/entities/class.entity";
import { Gym } from "src/gyms/entities/gym.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Instructor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.id, { eager: true })
    user: User;

    @ManyToOne(() => Gym, (gym) => gym.instructors)
    gym: Gym;

    @OneToMany(() => Class, (cls) => cls.instructor)
    assignedClass: Class[]
}
