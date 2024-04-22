import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDER_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy

  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderClient.send('createOrder', createOrderDto)
      .pipe(
        catchError(catchError(err => {
          throw new RpcException(err)
        }))
      )
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.orderClient.send('findAllOrders', paginationDto)
      .pipe(
        catchError(err => {
          throw new RpcException(err)
        })
      )

  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderClient.send('findOneOrder', { id })
      .pipe(
        catchError(err => {
          throw new RpcException(err);
        })
      )
  }

}
