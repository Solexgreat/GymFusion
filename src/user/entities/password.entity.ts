import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PasswordReset{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    token: string;

    @Column({ type: 'datetime' })
    expiredAt: Date;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @OneToOne(() => User, (user) => user.passwordReset)
    @JoinColumn()
    user: User

}