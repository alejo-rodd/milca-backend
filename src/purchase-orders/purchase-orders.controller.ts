import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { CreateDetailOrderDto } from './dto/create-detail-order.dtos';
import { PurchaseOrderStatus } from './enums/status.enum';
import { FilterByStatusDto } from './dto/filter-by-status.dto';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  @Post('detail')
  createDetailOrder(@Body() createDetailOrderDto: CreateDetailOrderDto) {
    return this.purchaseOrdersService.createDetailOrder(createDetailOrderDto);
  }

  @Get()
  findAll(@Query() filterByStatus: FilterByStatusDto) {
    return this.purchaseOrdersService.findAll(filterByStatus);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrdersService.findOne(id);
  }

  @Get('details-br-order/:id')
  findDetailsByOrderId(@Param('id') id: string) {
    return this.purchaseOrdersService.findDetailsByOrderId(id);
  }

  @Get('detail/:id')
  findDetailById(@Param('id') id: string) {
    return this.purchaseOrdersService.findDetailById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    return this.purchaseOrdersService.update(id, updatePurchaseOrderDto);
  }

  @Get('sales/report')
  getSalesReport(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('groupBy') groupBy: 'day' | 'week' | 'month' = 'day',
  ) {
    return this.purchaseOrdersService.reportSalesByDateRange(
      startDate,
      endDate,
      groupBy,
    );
  }

  @Get('mugs-sold/report')
  getMugsSoldReport(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.purchaseOrdersService.reportMugsSoldByCollection(
      startDate,
      endDate,
    );
  }
}
