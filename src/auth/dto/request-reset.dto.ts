import { IsNumber, IsPhoneNumber } from 'class-validator';

export class RequestResetDto {
  //   @IsPhoneNumber('CO', { message: 'El número de teléfono debe ser un número colombiano válido.' })
  @IsNumber()
  phone: number;
}
