import { PurchaseOrderStatus } from "../enums/status.enum";
import { IsEnum, IsOptional } from "class-validator";

export class FilterByStatusDto {
    @IsEnum(PurchaseOrderStatus)
    @IsOptional()
    status?: PurchaseOrderStatus;
}