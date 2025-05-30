import { DetailOrder } from 'src/purchase-orders/entities/detail-order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('numeric')
  price: number;
  @Column('boolean')
  isActual: boolean;
  @CreateDateColumn({
    type: 'date',
    default: () => "CURRENT_DATE + INTERVAL '1 day'",
  })
  initialDate: Date;
  @DeleteDateColumn({ type: 'date', nullable: true })
  finalDate?: Date;

  @OneToMany(() => DetailOrder, (detailOrder) => detailOrder.priceHistory)  detailOrders?: DetailOrder[];
}
