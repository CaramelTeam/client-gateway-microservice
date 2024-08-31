import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe } from '@nestjs/common';

import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDER_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateOrderDto } from './dto';

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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderClient.send('findOneOrder', { id })
      .pipe(
        catchError(err => {
          throw new RpcException(err);
        })
      )
  }

}
