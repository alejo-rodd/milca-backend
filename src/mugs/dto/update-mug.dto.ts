import { PartialType } from '@nestjs/swagger';
import { CreateMugDto } from './create-mug.dto';

export class UpdateMugDto extends PartialType(CreateMugDto) {}
