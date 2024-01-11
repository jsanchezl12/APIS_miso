import {Body, Controller, Delete, Get, HttpCode, 
  Param, Post, Put, UseInterceptors, UseGuards, Logger
} from '@nestjs/common';

import { RegionService } from './region.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { RegionEntity } from './region.entity';
import { RegionDTO } from './region.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('region')
@UseInterceptors(BusinessErrorsInterceptor)
export class RegionController {
  private readonly logger = new Logger(RegionController.name);
    constructor(private readonly regionService: RegionService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
      this.logger.debug('findAll');
      return await this.regionService.findAll();
    }
  
    @Get(':regionId')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('regionId') regionId: string) {
      this.logger.debug('findOne');
      return await this.regionService.findOne(regionId);
    }
  
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() regionDto: RegionDTO) {
      this.logger.debug('create');
      const region: RegionEntity = plainToInstance(
        RegionEntity,
        regionDto,
      );
      return await this.regionService.create(region);
    }
  
    @Put(':regionId')
    @UseGuards(JwtAuthGuard)
    async update(@Param('regionId') regionId: string, @Body() regionDto: RegionDTO,
    ) {
      this.logger.debug('update');
      const region: RegionEntity = plainToInstance(
        RegionEntity,
        regionDto,
      );
      return await this.regionService.update(regionId, region);
    }
  
    @HttpCode(204)
    @Delete(':regionId')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('regionId') regionId: string) {
      this.logger.debug('update');
      return await this.regionService.delete(regionId);
    }
}
