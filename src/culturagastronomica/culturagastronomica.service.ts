/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturagastronomicaEntity } from './culturagastronomica.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturagastronomicaService {
    cacheKey = "gastroculture";
    constructor(
        @InjectRepository(CulturagastronomicaEntity)
        private readonly culturagastronomicaRepository: Repository<CulturagastronomicaEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) { }

    async findAll(): Promise<CulturagastronomicaEntity[]> {
        const cached: CulturagastronomicaEntity[] = await this.cacheManager.get<CulturagastronomicaEntity[]>(this.cacheKey);
        if (!cached) {
            const gastrocultures: CulturagastronomicaEntity[] = await this.culturagastronomicaRepository.find({
                relations: ["restaurante", "pais", "producto", "recetas"]
            });
            await this.cacheManager.set(this.cacheKey, gastrocultures);
            return gastrocultures;
        }
        return cached;
    }

    async findOne(id: string): Promise<CulturagastronomicaEntity> {
        const culturagastronomica: CulturagastronomicaEntity = await this.culturagastronomicaRepository.findOne({
            where: { id }, relations: ["restaurante", "pais", "producto", "recetas"]
        });
        if (!culturagastronomica) {
            throw new BusinessLogicException("The gastronomic culture with the given id was not found", BusinessError.NOT_FOUND);
        }
        return culturagastronomica;
    }

    async create(culturagastronomica: CulturagastronomicaEntity): Promise<CulturagastronomicaEntity> {
        return await this.culturagastronomicaRepository.save(culturagastronomica);
    }

    async update(id: string, culturagastronomicaRepository: CulturagastronomicaEntity): Promise<CulturagastronomicaEntity> {
        const persistedCulturagastronomica: CulturagastronomicaEntity = await this.culturagastronomicaRepository.findOne({ where: { id } });
        if (!persistedCulturagastronomica) {
            throw new BusinessLogicException("The gastronomic culture with the given id was not found", BusinessError.NOT_FOUND);
        }

        return await this.culturagastronomicaRepository.save({ ...persistedCulturagastronomica, ...culturagastronomicaRepository });
    }

    async delete(id: string) {
        const culturagastronomica: CulturagastronomicaEntity = await this.culturagastronomicaRepository.findOne({ where: { id } });
        if (!culturagastronomica) {
            throw new BusinessLogicException("The gastronomic culture with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.culturagastronomicaRepository.remove(culturagastronomica);
    }
}
