import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    try {
      const client = this.clientRepository.create(createClientDto);
      return await this.clientRepository.save(client);
    } catch (error) {
      throw new InternalServerErrorException('Errror al crear el cliente');
    }
  }

  async findOne(id: string) {
    try {
      return await this.clientRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
  }
}
