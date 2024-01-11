import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from './producto.entity';
import { ProductoDTO } from './productoDTO';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('producto')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.productoService.findAll();
  }

  @Get(':productoId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('productoId') productoId: string) {
    return await this.productoService.findOne(productoId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() productoDto: ProductoDTO) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.create(producto);
  }

  @Put(':productoId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('productoId') productoId: string,
    @Body() productoDto: ProductoDTO,
  ) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.update(productoId, producto);
  }

  @HttpCode(204)
  @Delete(':productoId')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('productoId') productoId: string) {
    return await this.productoService.delete(productoId);
  }
}
