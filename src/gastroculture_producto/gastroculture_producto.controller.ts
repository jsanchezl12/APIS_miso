/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards, Logger } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from '../producto/producto.entity';
import { ProductoDTO } from '../producto/productoDTO';
import { GastrocultureProductoService } from './gastroculture_producto.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';



@Controller('culturagastronomica')
@UseInterceptors(BusinessErrorsInterceptor)
export class GastrocultureProductoController {
    private readonly logger = new Logger(GastrocultureProductoController.name);
    constructor(private readonly gcultureProductoService: GastrocultureProductoService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':gcultureId/productos/:productoId')
    async addProductGCulture(@Param('gcultureId') gcultureId: string, @Param('productoId') productoId: string) {
        this.logger.debug('addProductGCulture');
        return await this.gcultureProductoService.addProductGCulture(gcultureId, productoId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':gcultureId/productos/:productoId')
    async findProductoByGCultureIdProductoId(@Param('gcultureId') gcultureId: string, @Param('productoId') productoId: string) {
        this.logger.debug('findProductoByGCultureIdProductoId');
        return await this.gcultureProductoService.findProductoByGCultureIdProductoId(gcultureId, productoId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':gcultureId/productos')
    async findProductoByGCultureId(@Param('gcultureId') gcultureId: string) {
        this.logger.debug('findProductoByGCultureId');
        return await this.gcultureProductoService.findProductoByGCultureId(gcultureId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':gcultureId/productos')
    async associateProductGCulture(@Body() productoDto: ProductoDTO[], @Param('gcultureId') gcultureId: string) {
        this.logger.debug('associateProductGCulture');
        //const restaurante = plainToInstance(RestauranteEntity, restauranteDto)
        const producto = plainToInstance(ProductoEntity, productoDto)[0];
        return await this.gcultureProductoService.associateProductGCulture(gcultureId, producto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':gcultureId/productos/:productoId')
    @HttpCode(204)
    async deleteProductoGCulture(@Param('gcultureId') gcultureId: string, @Param('productoId') productoId: string) {
        this.logger.debug('deleteProductoGCulture');
        return await this.gcultureProductoService.deleteProductoGCulture(gcultureId, productoId);
    }
}
