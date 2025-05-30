import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MugsService } from './mugs.service';
import { CreateMugDto } from './dto/create-mug.dto';
import { UpdateMugDto } from './dto/update-mug.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('mugs')
export class MugsController {
  constructor(private readonly mugsService: MugsService) {}

  @Post('create-designed')
  // @Auth(ValidRoles.admin)
  async createDesigned(@Body() createMugDto: CreateMugDto) {
    return await this.mugsService.create(createMugDto, true);
  }

  @Post('create-custom')
  async createCustom(@Body() createMugDto: CreateMugDto) {
    return await this.mugsService.create(createMugDto, false);
  }

  @Patch(':id')
  // @Auth(ValidRoles.admin)
  async update(@Param('id') id: string, @Body() updateMugDto: UpdateMugDto) {
    return this.mugsService.update(id, updateMugDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mugsService.findOne(id);
  }

  @Get('collection/:id')
  getByCollectionId(@Param('id') id: string) {
    return this.mugsService.findAllByCollectionId(id);
  }

  @Delete(':id')
  // @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.mugsService.remove(id);
  }
}
