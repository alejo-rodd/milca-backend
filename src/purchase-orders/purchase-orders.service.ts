import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DetailOrder } from './entities/detail-order.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { Client } from 'src/clients/entities/client.entity';
import { PurchaseOrderStatus } from './enums/status.enum';
import { CreateDetailOrderDto } from './dto/create-detail-order.dtos';
import { FilterByStatusDto } from './dto/filter-by-status.dto';
import { ImagesService } from 'src/images/images.service';
import { PriceHistoryService } from 'src/price-history/price-history.service';
import { TwilioService } from 'src/twilio/twilio.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private readonly priceHistoryService: PriceHistoryService,
    private readonly imagesService: ImagesService,
    private readonly twilioService: TwilioService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(DetailOrder)
    private readonly detailOrderRepository: Repository<DetailOrder>,
  ) {}

  async create(CreatePurchaseOrderDto: CreatePurchaseOrderDto) {
    const { client } = CreatePurchaseOrderDto;
    try {
      const purchaseOrder = this.purchaseOrderRepository.create({
        client,
        status: PurchaseOrderStatus.OPENED,
      });
      const savedPurchaseOrder =
        await this.purchaseOrderRepository.save(purchaseOrder);

      await this.sendNotification(client);
      return savedPurchaseOrder;
    } catch (error) {
      console.error('Error al crear la orden de compra:', error);
      throw new InternalServerErrorException(
        'Error al crear la orden de compra',
      );
    }
  }

  async update(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    const { status } = updatePurchaseOrderDto;
    try {
      const purchaseOrder = await this.purchaseOrderRepository.preload({ id });
      if (!purchaseOrder) {
        throw new BadRequestException('La orden de compra no existe');
      }
      purchaseOrder.status = status;
      return await this.purchaseOrderRepository.save(purchaseOrder);
    } catch (error) {
      console.error('Error al actualizar la orden de compra:', error);
      throw new InternalServerErrorException(
        'Error al actualizar la orden de compra',
      );
    }
  }

  async findAll(filterByStatus: FilterByStatusDto) {
    const { status } = filterByStatus;

    const purchaseOrders = await this.purchaseOrderRepository.find({
      // where: status ? [{status}, { status: PurchaseOrderStatus.OPENED }] : {},
      where: { status: status ?? PurchaseOrderStatus.OPENED },
      relations: {
        client: true,
        details: {
          priceHistory: true,
        },
      },
      order: {
        date: 'DESC',
      },
      withDeleted: true,
    });
    return purchaseOrders.map((purchaseOrder) =>
      this.organizePurchaseOrderResponse(purchaseOrder),
    );
  }

  async findOne(id: string) {
    try {
      const purchaseOrder = await this.purchaseOrderRepository.findOne({
        where: { id },
        relations: {
          client: true,
          details: {
            priceHistory: true,
            mug: {
              images: true,
              color: true,
              collection: true,
            },
          },
        },
      });
      if (!purchaseOrder) {
        throw new BadRequestException('La orden de compra no existe');
      }
      // return purchaseOrder;
      // Modifica las imágenes y retorna la orden organizada
      if (purchaseOrder.details) {
        purchaseOrder.details.forEach((detail) => {
          if (detail.mug && detail.mug.images) {
            detail.mug.images = detail.mug.images.map((image) =>
              this.imagesService.getImageUrl(image.image),
            );
          }
        });
      }

      return this.totalizePurchaseOrder(purchaseOrder);
    } catch (error) {
      console.error('Error al buscar la orden de compra:', error);
      throw new InternalServerErrorException(
        'Error al buscar la orden de compra',
      );
    }
  }

  findDetailById(id: string) {
    throw new Error('Method not implemented.');
  }
  findDetailsByOrderId(id: string) {
    throw new Error('Method not implemented.');
  }

  async createDetailOrder(createDetailOrderDto: CreateDetailOrderDto) {
    const actualPrice = await this.priceHistoryService.findActualPrice();
    if (!actualPrice) {
      throw new BadRequestException('No hay un precio actual disponible');
    }
    const detailOrder = this.detailOrderRepository.create({
      ...createDetailOrderDto,
      priceHistory: actualPrice,
    });
    try {
      const savedDetailOrder =
        await this.detailOrderRepository.save(detailOrder);
      return savedDetailOrder;
    } catch (error) {
      console.error('Error al crear el detalle de la orden:', error);
      throw new InternalServerErrorException(
        'Error al crear el detalle de la orden',
      );
    }
  }

  organizePurchaseOrderResponse(purchaseOrder: PurchaseOrder) {
    const { details, ...purchaseOrderToResponse } = purchaseOrder;
    const total = details?.reduce((acc, detail) => {
      return (
        acc +
        detail.quantity *
          detail.priceHistory.price *
          (1 - detail.discount / 100)
      );
    }, 0);
    return {
      ...purchaseOrderToResponse,
      total,
    };
  }

  totalizePurchaseOrder(purchaseOrder: PurchaseOrder) {
    const total = purchaseOrder.details?.reduce((acc, detail) => {
      return (
        acc +
        detail.quantity *
          detail.priceHistory.price *
          (1 - detail.discount / 100)
      );
    }, 0);
    return {
      ...purchaseOrder,
      total,
    };
  }

  async sendNotification(client: Client) {
    const messsage = `Hola, recibiste un nuevo pedido, para ${client.name} ${client.lastName}, su número es ${client.phoneNumber}, para la ciudad de ${client.city} en la dirección ${client.shippingAddress}`;

    const users = await this.userRepository.find({ withDeleted: false });

    users.forEach((user) => {
      this.twilioService
        .sendWhatsApp({
          to: user.phoneNumber,
          body: messsage,
        })
        .catch((error) => {
          console.error('Error al enviar mensaje de WhatsApp:', error);
        });
    });
  }

  async reportSalesByDateRange(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month' = 'day',
  ) {
    // Get all purchase orders in the date range, including details and priceHistory
    const purchaseOrders = await this.purchaseOrderRepository.find({
      where: {
        date: Between(startDate, endDate),
        status: PurchaseOrderStatus.COMPLETED, // Only closed sales
      },
      relations: {
        details: {
          priceHistory: true,
        },
      },
      withDeleted: true,
    });

    // Helper to format date by group
    const formatDate = (date: Date) => {
      const d = new Date(date);
      if (groupBy === 'day') {
        return d.toISOString().slice(0, 10); // YYYY-MM-DD
      }
      if (groupBy === 'week') {
        // Get ISO week string: YYYY-Www
        const year = d.getUTCFullYear();
        const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
        const pastDaysOfYear =
          (d.valueOf() - firstDayOfYear.valueOf()) / 86400000;
        const week = Math.ceil(
          (pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7,
        );
        return `${year}-W${week.toString().padStart(2, '0')}`;
      }
      if (groupBy === 'month') {
        return d.toISOString().slice(0, 7); // YYYY-MM
      }
    };

    // Aggregate sales by group
    const salesMap = new Map<string, number>();
    for (const po of purchaseOrders) {
      const label = formatDate(po.date);
      const total =
        po.details?.reduce((acc, detail) => {
          return (
            acc +
            detail.quantity *
              detail.priceHistory.price *
              (1 - detail.discount / 100)
          );
        }, 0) ?? 0;
      salesMap.set(label!, (salesMap.get(label!) ?? 0) + total);
    }

    // Sort labels
    const labels = Array.from(salesMap.keys()).sort();
    const data = labels.map((label) => salesMap.get(label) ?? 0);

    return { labels, data };
  }

  async reportMugsSoldByCollection(startDate: Date, endDate: Date) {
    const purchaseOrders = await this.purchaseOrderRepository.find({
      where: {
        date: Between(startDate, endDate),
        status: PurchaseOrderStatus.COMPLETED,
      },
      relations: {
        details: {
          mug: {
            collection: true,
          },
        },
      },
      withDeleted: true,
    });

    const collectionMap = new Map<string, number>();

    for (const po of purchaseOrders) {
      for (const detail of po.details ?? []) {
        const collectionName =
          detail.mug?.collection?.name ?? 'Creado por cliente';
        const quantity = Number(detail.quantity) || 0; // Asegura que sea número
        collectionMap.set(
          collectionName,
          (collectionMap.get(collectionName) ?? 0) + quantity,
        );
      }
    }

    const labels = Array.from(collectionMap.keys());
    const data = labels.map((label) => collectionMap.get(label) ?? 0);

    return { labels, data };
  }
}
