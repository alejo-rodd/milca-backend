import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { DetailOrder } from './entities/detail-order.entity';
import { PriceHistoryService } from 'src/price-history/price-history.service';
import { PriceHistoryModule } from 'src/price-history/price-history.module';
import { ClientsModule } from 'src/clients/clients.module';
import { MugsModule } from 'src/mugs/mugs.module';
import { ImagesModule } from 'src/images/images.module';
import { AuthModule } from 'src/auth/auth.module';
import { TwilioModule } from 'src/twilio/twilio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrder, DetailOrder]),
    PriceHistoryModule,
    ClientsModule,
    MugsModule,
    ImagesModule,
    AuthModule,
    TwilioModule,
  ],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService, PriceHistoryService],
})
export class PurchaseOrdersModule {}
