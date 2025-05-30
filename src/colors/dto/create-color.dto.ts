import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateColorDto {
  @ApiProperty({example: 'Rojo'})
  @IsString()
  name: string;

  @ApiProperty({example: '#FF0000'})
  @IsString()
  code: string;
}
