import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from './entities/color.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ColorsController],
  providers: [ColorsService],
  imports: [TypeOrmModule.forFeature([Color]), AuthModule],
  exports: [TypeOrmModule],
})
export class ColorsModule {}
