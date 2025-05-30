import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMugDto } from './dto/create-mug.dto';
import { UpdateMugDto } from './dto/update-mug.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mug } from './entities/mug.entity';
import { DataSource, In, Repository } from 'typeorm';
import { MugImage } from './entities/mug-image.entity';
import { ImagesService } from 'src/images/images.service';
import { Collection } from 'src/collections/entities/collection.entity';

@Injectable()
export class MugsService {
  constructor(
    private readonly imagesService: ImagesService,
    @InjectRepository(Mug)
    private readonly mugRepository: Repository<Mug>,
    @InjectRepository(MugImage)
    private readonly mugImagesRepository: Repository<MugImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createMugDto: CreateMugDto, isDesigned: boolean) {
    try {
      const {
        images = [],
        colorId,
        collectionId,
        ...mugDetails
      } = createMugDto;

      const mug = this.mugRepository.create({
        ...mugDetails,
        color: { id: colorId },
        collection: isDesigned? { id: collectionId } : undefined,
        isDesigned,
        images: images.map((image) =>
          this.mugImagesRepository.create({ image: image }),
        ),
      });
      await this.mugRepository.save(mug);

      const mugResponse = {
        ...mug,
        images: images.map((image) => this.imagesService.getImageUrl(image)),
      };

      return mugResponse;
    } catch (error) {
      throw new InternalServerErrorException('Error al guardar la taza');
    }
  }

  async findAllByCollectionId(collectionId: string) {
    try {
      const mugs = await this.mugRepository.find({
        where: { collection: { id: collectionId }, isDesigned: true },
        relations: {
          images: true,
          collection: true,
          color: true,
        },
      });

      const mugsResponse = mugs.map((mug) => ({
        ...mug,
        images: mug.images?.map((img) =>
          this.imagesService.getImageUrl(img.image),
        ),
      }));

      return mugsResponse;
    } catch (error) {
      throw new BadRequestException(
        'Error al buscar la taza, verifique el ID de la colección',
      );
    }
  }

  async findOne(id: string) {
    try {
      const { images: mugImages, ...mug } =
        await this.mugRepository.findOneOrFail({
          where: { id },
          relations: {
            images: true,
            collection: true,
            color: true,
          },
        });
      let images: string[] = [];

      if (mugImages) {
        images = mugImages.map((image) =>
          this.imagesService.getImageUrl(image.image),
        );
      }

      const mugResponse = {
        ...mug,
        images,
      };
      return mugResponse;
    } catch (error) {
      throw new BadRequestException('Error al buscar la taza, verifique el ID');
    }
  }

  async update(id: string, updateMugDto: UpdateMugDto) {
    const { images, colorId, collectionId, ...toUpdate } = updateMugDto;

    const mugToUpdate = {
      ...toUpdate,
      color: colorId ? { id: colorId } : undefined,
      collection: collectionId ? { id: collectionId } : undefined,
    }

    const mug = await this.mugRepository.preload({ id, ...mugToUpdate });

    if (!mug) throw new NotFoundException(`Taza con id ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images && images.length > 0) {
        // Eliminar las imágenes antiguas asociadas a la taza
        await queryRunner.manager.delete(MugImage, { mug: { id } });

        mug.images = images.map((image) =>
          this.mugImagesRepository.create({ image: image }),
        );
      }

      // await this.productRepository.save( product );
      await queryRunner.manager.save(mug);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new InternalServerErrorException('Error al actualizar la taza');
    }
  }

  async remove(id: string) {
    try {
      return await this.mugRepository.softRemove({ id });
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la taza');
    }
  }

  getImagesUrl(images: string[]) {
    return images.map((image) => this.imagesService.getImageUrl(image));
  }
}
