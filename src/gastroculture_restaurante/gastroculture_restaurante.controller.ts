/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards, Logger } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteDTO } from '../restaurante/restaurante.dto/restaurante.dto';
import { GastrocultureRestauranteService } from './gastroculture_restaurante.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';


@Controller('culturagastronomica')
@UseInterceptors(BusinessErrorsInterceptor)
export class GastrocultureRestauranteController {
    private readonly logger = new Logger(GastrocultureRestauranteController.name);
    constructor(private readonly gcultureRestauranteService: GastrocultureRestauranteService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':gcultureId/restaurantes/:restaurantId')
    async addRestaurantGCulture(@Param('gcultureId') gcultureId: string, @Param('restaurantId') restaurantId: string) {
        this.logger.debug('addRestaurantGCulture');
        return await this.gcultureRestauranteService.addRestaurantGCulture(gcultureId, restaurantId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':gcultureId/restaurantes/:restaurantId')
    async findRestauranteByGCultureIdRestauranteId(@Param('gcultureId') gcultureId: string, @Param('restaurantId') restaurantId: string) {
        this.logger.debug('findRestauranteByGCultureIdRestauranteId');
        return await this.gcultureRestauranteService.findRestauranteByGCultureIdRestauranteId(gcultureId, restaurantId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':gcultureId/restaurantes')
    async findRestauranteByGCultureId(@Param('gcultureId') gcultureId: string) {
        this.logger.debug('findRestauranteByGCultureId');
        return await this.gcultureRestauranteService.findRestauranteByGCultureId(gcultureId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':gcultureId/restaurantes')
    async associateRestaurantGCulture(@Body() restauranteDto: RestauranteDTO[], @Param('gcultureId') gcultureId: string) {
        this.logger.debug('associateRestaurantGCulture');
        //const restaurante = plainToInstance(RestauranteEntity, restauranteDto)
        const restaurante = plainToInstance(RestauranteEntity, restauranteDto)[0];
        return await this.gcultureRestauranteService.associateRestaurantGCulture(gcultureId, restaurante);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':gcultureId/restaurantes/:restaurantId')
    @HttpCode(204)
    async deleteRestauranteGCulture(@Param('gcultureId') gcultureId: string, @Param('restaurantId') restaurantId: string) {
        this.logger.debug('deleteRestauranteGCulture');
        return await this.gcultureRestauranteService.deleteRestauranteGCulture(gcultureId, restaurantId);
    }
}
