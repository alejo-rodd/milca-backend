import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Max } from "class-validator";

export class CreatePriceHistoryDto {

    @IsNumber()
    @Max(999999)
    @ApiProperty({
        description: 'Precio del producto',
        example: 25000,
        required: true,
        type: Number
    })
    price: number;

}
