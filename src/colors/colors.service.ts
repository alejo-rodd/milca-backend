import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    private readonly dataSource: DataSource,
  ) {}
  
  async create(createColorDto: CreateColorDto) {
    try {
      const color = this.colorRepository.create(createColorDto);
      await this.colorRepository.save(color);
      return color;
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el color');
    }
  }
  
  async findAll() {
    try {
      return await this.colorRepository.find({ withDeleted: false });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los colores');
    }
  }
  
  async findOne(id: string) {
    try {
      return await this.colorRepository.findOneOrFail({
        where: { id },
        withDeleted: true,
      });
    } catch (error) {
      throw new NotFoundException(`Color con ID ${id} no encontrado`);
    }
  }

  async update(id: string, updateColorDto: UpdateColorDto) {
    const color = await this.colorRepository.preload({id, ...updateColorDto});
    if(!color)
      throw new NotFoundException(`Color con ID ${id} no encontrado`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      await queryRunner.manager.save(color)
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(id);
    } catch(error){
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new InternalServerErrorException('Error al actualizar el color');
    }
  }

  async remove(id: string) {
    try {
      const color = await this.findOne(id);
      return await this.colorRepository.softRemove(color);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el color');
    }
  }
}
