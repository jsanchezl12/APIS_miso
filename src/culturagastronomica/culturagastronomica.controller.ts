/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturagastronomicaDto } from './culturagastronomica.dto';
import { CulturagastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaService } from './culturagastronomica.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';


@Controller('culturagastronomica')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturagastronomicaController {
  private readonly logger = new Logger(CulturagastronomicaController.name);

  constructor(private readonly gastrocultureService: CulturagastronomicaService) { }

  
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    this.logger.debug('findAll');
    return await this.gastrocultureService.findAll();
  }

  @Get(':gastrocultureId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('gastrocultureId') gastrocultureId: string) {
    this.logger.debug('findOne');
    return await this.gastrocultureService.findOne(gastrocultureId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() gastrocultureDto: CulturagastronomicaDto) {
    this.logger.debug('create');
    const gastroculture: CulturagastronomicaEntity = plainToInstance(CulturagastronomicaEntity, gastrocultureDto);
    return await this.gastrocultureService.create(gastroculture);
  }

  
  @Put(':gastrocultureId')
  @UseGuards(JwtAuthGuard)
  async update(@Param('gastrocultureId') gastrocultureId: string, @Body() gastrocultureDto: CulturagastronomicaDto) {
    this.logger.debug('update');
    const gastroculture: CulturagastronomicaEntity = plainToInstance(CulturagastronomicaEntity, gastrocultureDto);
    return await this.gastrocultureService.update(gastrocultureId, gastroculture);
  }

  
  @Delete(':gastrocultureId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(@Param('gastrocultureId') gastrocultureId: string) {
    this.logger.debug('delete');
    return await this.gastrocultureService.delete(gastrocultureId);
  }

}
