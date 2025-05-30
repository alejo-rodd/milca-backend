import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  async create(@Body() createColorDto: CreateColorDto) {
    return await this.colorsService.create(createColorDto);
  }

  @Get()
  async findAll() {
    return await this.colorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.colorsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateColorDto: UpdateColorDto,
  ){
    return this.colorsService.update(id, updateColorDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id') id: string) {
    return await this.colorsService.remove(id);
  }
}
