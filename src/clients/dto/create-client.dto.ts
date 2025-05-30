import { IsNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;
  @IsString()
  lastName: string;
  @IsNumber()
  phoneNumber: number;
  @IsString()
  city: string;
  @IsString()
  shippingAddress: string;
  @IsString()
  notesAddress?: string; // Optional field
}
