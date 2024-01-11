/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards, Logger } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { PaisEntity } from '../pais/pais.entity';
import { PaisDTO } from '../pais/pais.dto';
import { GastroculturePaisService } from '../gastroculture_pais/gastroculture_pais.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';


@Controller('culturagastronomica')
@UseInterceptors(BusinessErrorsInterceptor)
export class GastroculturePaisController {
    private readonly logger = new Logger(GastroculturePaisController.name);
    constructor(private readonly gculturePaisService: GastroculturePaisService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':gcultureId/paises/:paisId')
    async addCountryGCulture(@Param('gcultureId') gcultureId: string, @Param('paisId') paisId: string) {
        this.logger.debug('addCountryGCulture');
        return await this.gculturePaisService.addCountryGCulture(gcultureId, paisId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':gcultureId/paises/:paisId')
    async findPaisByGCultureIdPaisId(@Param('gcultureId') gcultureId: string, @Param('paisId') paisId: string) {
        this.logger.debug('findPaisByGCultureIdPaisId');
        return await this.gculturePaisService.findPaisByGCultureIdPaisId(gcultureId, paisId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':gcultureId/paises')
    async findPaisByGCultureId(@Param('gcultureId') gcultureId: string) {
        this.logger.debug('findPaisByGCultureId');
        return await this.gculturePaisService.findPaisByGCultureId(gcultureId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':gcultureId/paises')
    async associatePaisGCulture(@Body() paisDto: PaisDTO[], @Param('gcultureId') gcultureId: string) {
        this.logger.debug('associatePaisGCulture');
        //const restaurante = plainToInstance(RestauranteEntity, restauranteDto)
        const pais = plainToInstance(PaisEntity, paisDto)[0];
        return await this.gculturePaisService.associatePaisGCulture(gcultureId, pais);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':gcultureId/paises/:paisId')
    @HttpCode(204)
    async deletePaisGCulture(@Param('gcultureId') gcultureId: string, @Param('paisId') paisId: string) {
        this.logger.debug('deletePaisGCulture');
        return await this.gculturePaisService.deletePaisGCulture(gcultureId, paisId);
    }
}
