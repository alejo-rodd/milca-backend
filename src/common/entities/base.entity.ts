import { PrimaryGeneratedColumn, Column, BeforeInsert, BeforeSoftRemove, CreateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date = new Date();

  @DeleteDateColumn({ type: 'date', nullable: true })
  deletedAt?: Date;
}
