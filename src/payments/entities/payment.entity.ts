import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentIntentId: string; // Stripe Payment Intent ID

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: string; // e.g., succeeded, failed, pending

  @CreateDateColumn()
  createdAt: Date;
}