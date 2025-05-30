import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Delete,
  Body,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Photo file to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Photo file (JPG, PNG, or JPEG format)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {fileName: (await this.imagesService.uploadImage(file)).public_id};
  }

  @Get(':publicId')
  async getImageUrl(@Param('publicId') publicId: string) {
    return await this.imagesService.getImageUrl(publicId);
  }

  @Delete()
  async deleteImage(@Query('publicId') publicId: string) {
    return this.imagesService.deleteImage(publicId);
  }
}
