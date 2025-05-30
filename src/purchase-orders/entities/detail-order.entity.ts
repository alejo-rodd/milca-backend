import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PriceHistory } from 'src/price-history/entities/price-history.entity';
import { Mug } from 'src/mugs/entities/mug.entity';

@Entity()
export class DetailOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('numeric')
  quantity: number;
  @Column('numeric', { default: 0 })
  discount: number;

  @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.details)
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => PriceHistory, (priceHistory) => priceHistory.detailOrders)
  priceHistory: PriceHistory;

  @ManyToOne(() => Mug, (mug) => mug.detailOrders)
  mug: Mug;
}
