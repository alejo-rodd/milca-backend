import { PriceHistory } from 'src/price-history/entities/price-history.entity';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { Mug } from 'src/mugs/entities/mug.entity';
import { IsNumber, IsObject, Min } from 'class-validator';

export class CreateDetailOrderDto {
  @IsNumber()
  @Min(1)
  quantity: number;
  @IsNumber()
  @Min(0)
  discount: number;
  @IsObject()
  purchaseOrder: PurchaseOrder;
  // priceHistory: PriceHistory;
  @IsObject()
  mug: Mug;
}
