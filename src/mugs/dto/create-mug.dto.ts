import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMugDto {
  @IsString()
  @MaxLength(25)
  title: string;

  @IsString()
  @MaxLength(25)
  phrase: string;

  @IsString()
  @MaxLength(400)
  notes: string;

  @IsString()
  colorId: string;

  @IsString()
  collectionId: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
