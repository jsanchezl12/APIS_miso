import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteDTO } from './restaurante.dto/restaurante.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('restaurante')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.restauranteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':restauranteId')
  async findOne(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.findOne(restauranteId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() restauranteDto: RestauranteDTO) {
    const restaurante: RestauranteEntity = plainToInstance(
      RestauranteEntity,
      restauranteDto,
    );
    return await this.restauranteService.create(restaurante);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':restauranteId')
  async update(
    @Param('restauranteId') restauranteId: string,
    @Body() restauranteDto: RestauranteDTO,
  ) {
    const restaurante: RestauranteEntity = plainToInstance(
      RestauranteEntity,
      restauranteDto,
    );
    return await this.restauranteService.update(restauranteId, restaurante);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':restauranteId')
  @HttpCode(204)
  async delete(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.delete(restauranteId);
  }
}
