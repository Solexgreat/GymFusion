import { Class } from "src/class/entities/class.entity";
import { Instructor } from "src/instructors/entities/instructor.entity";
import { Subscription } from "src/subscriptions/entities/subscription.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gym {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    location: string;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    owner: User;

    @OneToMany(() => Subscription, (subscription) => subscription.gym)
    subscriptions: Subscription[];

    @OneToMany(() => Instructor, (instructor) => instructor.gym)
    instructors: Instructor[];

    @OneToMany(() => Class, (cls) => cls.gym)
    classes: Class[];
}
