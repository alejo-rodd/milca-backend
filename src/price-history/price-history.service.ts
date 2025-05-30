import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePriceHistoryDto } from './dto/create-price-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceHistory } from './entities/price-history.entity';

@Injectable()
export class PriceHistoryService {
  constructor(
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepository: Repository<PriceHistory>,
  ) {}

  async create(createPriceHistoryDto: CreatePriceHistoryDto) {
    try{
      const priceHistory = this.priceHistoryRepository.create({
        ...createPriceHistoryDto,
        isActual: true,
      });

      const actualPrice = await this.findActualPrice();
      if (actualPrice != null) await this.softRemove(actualPrice);
      
      return await this.priceHistoryRepository.save(priceHistory);

    } catch (error) {
      throw new InternalServerErrorException(
        'Error al crear el historial de precios',
      );
    }
  }

  async findAll() {
    try {
      return await this.priceHistoryRepository.find({
        order: { initialDate: 'DESC' },
        withDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener el historial de precios',
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.priceHistoryRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener el historial de precios con ID ${id}`,
      );
    }
  }

  async findActualPrice() {
    try {
      return await this.priceHistoryRepository.findOne({
        where: { isActual: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener el precio actual',
      );
    }
  }

  async softRemove(priceHistory: PriceHistory) {
    try {
      priceHistory.isActual = false;
      await this.priceHistoryRepository.save(priceHistory);
      const result = await this.priceHistoryRepository.softRemove(priceHistory);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al actualizar el historial de precios',
      );
    }
  }

  // update(id: number, updatePriceHistoryDto: UpdatePriceHistoryDto) {
  //   return `This action updates a #${id} priceHistory`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} priceHistory`;
  // }
}
