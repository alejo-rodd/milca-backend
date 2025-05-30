import { Module } from '@nestjs/common';
import { MugsService } from './mugs.service';
import { MugsController } from './mugs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mug } from './entities/mug.entity';
import { MugImage } from './entities/mug-image.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesModule } from 'src/images/images.module';
import { CollectionsModule } from 'src/collections/collections.module';

@Module({
  controllers: [MugsController],
  providers: [MugsService],
  imports: [
    TypeOrmModule.forFeature([Mug, MugImage]),
    ImagesModule,
    AuthModule,
  ],
  exports: [TypeOrmModule],
})
export class MugsModule {}
