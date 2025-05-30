import { IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  //   @IsPhoneNumber()
  @IsNumber()
  phone: number;

  @IsString()
  @Length(6, 6)
  code: string;
}
