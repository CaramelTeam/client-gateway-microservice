import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) { }

  @Post()
  createProduct(@Body() createProduct: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProduct)
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_products' }, paginationDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    return this.productsClient.send({ cmd: 'find_onde_product' }, { id })
      .pipe(catchError(err => { throw new RpcException(err) }))

    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_onde_product' }, { id })
    //   );
    //   return product
    // } catch (error) {
    //   throw new RpcException(error);
    // }

  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Patch(':id')
  patchProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProduct: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update_product' }, { id, ...updateProduct })
      .pipe(catchError(err => { throw new RpcException(err) }))
  }


}
