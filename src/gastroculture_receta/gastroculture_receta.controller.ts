/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RecetaEntity } from '../receta/receta.entity';
import { RecetaDTO } from '../receta/recetaDTO';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { GastrocultureRecetaService } from './gastroculture_receta.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';


@Controller('culturagastronomica')
@UseInterceptors(BusinessErrorsInterceptor)
export class GastrocultureRecetaController {
    private readonly logger = new Logger(GastrocultureRecetaController.name);
    constructor(private readonly gcultureRecetaService: GastrocultureRecetaService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':gcultureId/recetas/:recetaId')
    async addRecipeGCulture(@Param('gcultureId') gcultureId: string, @Param('recetaId') recetaId: string) {
        this.logger.debug('addRecipeGCulture');
        return await this.gcultureRecetaService.addRecipeGCulture(gcultureId, recetaId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':gcultureId/recetas/:recetaId')
    async findRecetaByGCultureIdRecetaId(@Param('gcultureId') gcultureId: string, @Param('recetaId') recetaId: string) {
        this.logger.debug('findRecetaByGCultureIdRecetaId');
        return await this.gcultureRecetaService.findRecetaByGCultureIdRecetaId(gcultureId, recetaId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':gcultureId/recetas')
    async findRecetaByGCultureId(@Param('gcultureId') gcultureId: string) {
        this.logger.debug('findRecetaByGCultureId');
        return await this.gcultureRecetaService.findRecetaByGCultureId(gcultureId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':gcultureId/recetas')
    async associateRecipeGCulture(@Body() recetaDto: RecetaDTO[], @Param('gcultureId') gcultureId: string) {
        this.logger.debug('associateRecipeGCulture');
        //const restaurante = plainToInstance(RestauranteEntity, restauranteDto)
        const receta = plainToInstance(RecetaEntity, recetaDto);
        return await this.gcultureRecetaService.associateRecipeGCulture(gcultureId, receta);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':gcultureId/recetas/:recetaId')
    @HttpCode(204)
    async deleteRecetaGCulture(@Param('gcultureId') gcultureId: string, @Param('recetaId') recetaId: string) {
        this.logger.debug('deleteRecetaGCulture');
        return await this.gcultureRecetaService.deleteRecetaGCulture(gcultureId, recetaId);
    }
}
