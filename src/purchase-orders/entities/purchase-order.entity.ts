import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseOrderStatus } from '../enums/status.enum';
import { Client } from 'src/clients/entities/client.entity';
import { DetailOrder } from './detail-order.entity';

@Entity()
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn({
    type: 'date',
  })
  date: Date;
  @Column('enum', { enum: PurchaseOrderStatus })
  status: PurchaseOrderStatus;

  @OneToMany(() => DetailOrder, (detailOrder) => detailOrder.purchaseOrder, {
    cascade: true,
    eager: true,
  })
  details?: DetailOrder[];

  @ManyToOne(() => Client, (client) => client.purchaseOrders)
  client: Client;
}
