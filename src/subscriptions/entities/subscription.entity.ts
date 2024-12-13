import { Plans } from "src/enums/plan.enum";
import { Gym } from "src/gyms/entities/gym.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'enum', enum: Plans})
    plan: Plans;

    @Column('decimal')
    price: number;

    @Column({default: 'Active'})
    status: string

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToOne(() => User, (user) => user.subscriptions)
    user: User;

    @ManyToOne (() => Gym, (gym) => gym.subscriptions)
    gym: Gym;

}
