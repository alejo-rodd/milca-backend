import { IsObject } from "class-validator";
import { Client } from "src/clients/entities/client.entity";

export class CreatePurchaseOrderDto {
    @IsObject()
    client: Client;
}
