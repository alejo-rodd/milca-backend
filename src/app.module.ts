import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { ColorsModule } from './colors/colors.module';
import { CollectionsModule } from './collections/collections.module';
import { MugsModule } from './mugs/mugs.module';
import { AuthModule } from './auth/auth.module';
import { PhotosCatalogModule } from './photos-catalog/photos-catalog.module';
import { PriceHistoryModule } from './price-history/price-history.module';
import { DiscountsModule } from './discounts/discounts.module';
import { ClientsModule } from './clients/clients.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { ImagesModule } from './images/images.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: true,
      autoLoadEntities: true,
      synchronize: true,
    }),

    CommonModule,
    ColorsModule,
    CollectionsModule,
    MugsModule,
    AuthModule,
    PhotosCatalogModule,
    PriceHistoryModule,
    DiscountsModule,
    ClientsModule,
    PurchaseOrdersModule,
    ImagesModule,
  ],
})
export class AppModule {}
