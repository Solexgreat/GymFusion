import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentId: string; // Link to the Payment entity

  @Column()
  invoiceNumber: string;

  @Column()
  filePath: string; // Path to the stored invoice file

  @CreateDateColumn()
  createdAt: Date;
}