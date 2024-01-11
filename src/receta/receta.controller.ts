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
import { RecetaService } from './receta.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { RecetaEntity } from './receta.entity';
import { RecetaDTO } from './recetaDTO';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('receta')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.recetaService.findAll();
  }

  @Get(':recetaId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('recetaId') recetaId: string) {
    return await this.recetaService.findOne(recetaId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() recetaDto: RecetaDTO) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.create(receta);
  }

  @Put(':recetaId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('recetaId') recetaId: string,
    @Body() recetaDto: RecetaDTO,
  ) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.update(recetaId, receta);
  }

  @Delete(':recetaId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@Param('recetaId') recetaId: string) {
    return await this.recetaService.delete(recetaId);
  }
}
