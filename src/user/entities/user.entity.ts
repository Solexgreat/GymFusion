import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "src/enums/role.enum";
import { PasswordReset } from "./password.entity";
import { Subscription } from "src/subscriptions/entities/subscription.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column({nullable: true})
    phoneNumber?: number;

    @Column('date')
    dateOfBirth: string;

    @Column()
    gender: string;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({type: 'enum', enum: Role, default: Role.user})
    role?: Role;

    @Column({ nullable: true })
    refreshToken?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @CreateDateColumn()
    updatedAt?: Date;

    @OneToMany(() => Subscription, (subscription) => subscription.user)
    subscriptions?: Subscription[];

    @OneToOne(() => PasswordReset)
    passwordReset?: PasswordReset;
}
