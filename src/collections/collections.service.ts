import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    try {
      const collection = this.collectionRepository.create(createCollectionDto);
      await this.collectionRepository.save(collection);
      return collection;
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la colección');
    }
  }

  async findAll() {
    try {
      return await this.collectionRepository.find({
        withDeleted: false,
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener las colecciones',
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.collectionRepository.findOneOrFail({
        where: { id },
        relations: {
          mugs: true
        },
        withDeleted: true,
      });
    } catch (error) {
      throw new NotFoundException(`Colección con ID ${id} no encontrada`);
    }
  }

  findAllWithMugs() {
    try {
      return this.collectionRepository.find({
        relations: {
          mugs: {
            images: true,
          },
        },
        withDeleted: false,
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener las colecciones con mugs',
      );
    }
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    try {
      const collection = await this.collectionRepository.preload({
        id,
        ...updateCollectionDto,
      });

      if (!collection) {
        throw new NotFoundException(`Colección con ID ${id} no encontrada`);
      }

      return await this.collectionRepository.save(collection);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Error al actualizar la colección',
      );
    }
  }

  async remove(id: string) {
    try {
      const collection = await this.findOne(id);
      return await this.collectionRepository.softRemove(collection);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la colección');
    }
  }
}
