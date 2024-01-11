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
import { IngredienteService } from './ingrediente.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { IngredienteDto } from './ingrediente.dto/ingrediente.dto';
import { IngredienteEntity } from './ingrediente.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('ingrediente')
@UseInterceptors(BusinessErrorsInterceptor)
export class IngredienteController {
  constructor(private readonly ingredienteService: IngredienteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.ingredienteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':ingredienteId')
  async findOne(@Param('ingredienteId') ingredienteId: string) {
    return await this.ingredienteService.findOne(ingredienteId);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() ingredienteDto: IngredienteDto) {
    const ingrediente: IngredienteEntity = plainToInstance(
      IngredienteEntity,
      ingredienteDto,
    );
    return await this.ingredienteService.create(ingrediente);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':ingredienteId')
  async update(
    @Param('ingredienteId') ingredienteId: string,
    @Body() ingredienteDto: IngredienteDto,
  ) {
    const ingrediente: IngredienteEntity = plainToInstance(
      IngredienteEntity,
      ingredienteDto,
    );
    return await this.ingredienteService.update(ingredienteId, ingrediente);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':ingredienteId')
  @HttpCode(204)
  async delete(@Param('ingredienteId') ingredienteId: string) {
    return await this.ingredienteService.delete(ingredienteId);
  }
}
