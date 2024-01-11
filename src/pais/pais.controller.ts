import {Body, Controller, Delete, Get, HttpCode, 
  Param, Post, Put, UseInterceptors, UseGuards, Logger
} from '@nestjs/common';
import { PaisService } from './pais.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { PaisEntity } from './pais.entity';
import { PaisDTO } from './pais.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('pais')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisController {
  private readonly logger = new Logger(PaisController.name);
    constructor(private readonly paisService: PaisService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
      this.logger.debug('findAll');
      return await this.paisService.findAll();
    }
  
    @Get(':paisId')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('paisId') restauranteId: string) {
      this.logger.debug('findOne');
      return await this.paisService.findOne(restauranteId);
    }
  
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() paisDto: PaisDTO) {
      this.logger.debug('create');
      const pais: PaisEntity = plainToInstance(
        PaisEntity,
        paisDto,
      );
      return await this.paisService.create(pais);
    }
  
    @Put(':paisId')
    @UseGuards(JwtAuthGuard)
    async update(@Param('paisId') paisId: string, @Body() paisDto: PaisDTO,
    ) {
      this.logger.debug('update');
      const pais: PaisEntity = plainToInstance(
        PaisEntity,
        paisDto,
      );
      return await this.paisService.update(paisId, pais);
    }
  
    @HttpCode(204)
    @Delete(':paisId')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('paisId') paisId: string) {
      this.logger.debug('update');
      return await this.paisService.delete(paisId);
    }
}

