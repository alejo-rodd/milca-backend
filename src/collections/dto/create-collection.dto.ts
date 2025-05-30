import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ example: 'Capitan America' })
  @IsString()
  name: string;
  @ApiProperty({ example: 'Tazas del superhéroe' })
  @IsString()
  description: string;
}
