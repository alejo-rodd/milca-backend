import { PurchaseOrder } from 'src/purchase-orders/entities/purchase-order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  name: string;
  @Column('text')
  lastName: string;
  @Column('numeric')
  phoneNumber: number;
  @Column('text')
  city: string;
  @Column('text')
  shippingAddress: string;
  @Column('text', { nullable: true })
  notesAddress?: string;

  @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.client)
  purchaseOrders?: PurchaseOrder[];
}
