import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';
import { PurchaseOrderStatus } from '../enums/status.enum';
import { IsEnum } from 'class-validator';

export class UpdatePurchaseOrderDto extends PartialType(CreatePurchaseOrderDto) {

    @IsEnum(PurchaseOrderStatus)
    status: PurchaseOrderStatus;

}
