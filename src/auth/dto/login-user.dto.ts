import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsString()
  @ApiProperty({
    example: 'prueba@gmail.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: 'Abc123',
  })
  password: string;
}
