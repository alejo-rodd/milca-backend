import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'prueba@gmail.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @ApiProperty({
    example: 'Abc123',
  })
  password: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    example: 'John Doe',
  })
  name: string;

  @IsNumber()
  @ApiProperty({
    example: 1234567890,
  })
  phoneNumber: number;
}
