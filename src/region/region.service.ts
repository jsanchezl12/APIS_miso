/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RegionEntity } from './region.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RegionService {

    cacheKey = "regiones";
    constructor(
        @InjectRepository(RegionEntity)
        private readonly regionRepository: Repository<RegionEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) { }

    async findAll(): Promise<RegionEntity[]> {
        const cached: RegionEntity[] = await this.cacheManager.get<RegionEntity[]>(this.cacheKey);
        if (!cached) {
            const regiones: RegionEntity[] = await this.regionRepository.find({
                relations: []
            });
            await this.cacheManager.set(this.cacheKey, regiones);
            return regiones;
        }
        return cached;
    }

    async findOne(id: string): Promise<RegionEntity> {
        const culturagastronomica: RegionEntity = await this.regionRepository.findOne({
            where: {id}, relations: []
        });
        if (!culturagastronomica) {
            throw new BusinessLogicException("The Region with the given id was not found", BusinessError.NOT_FOUND);
        }
        return culturagastronomica;
    }
    async create(culturagastronomica: RegionEntity): Promise<RegionEntity> {
        return await this.regionRepository.save(culturagastronomica);
    }

    async update(id: string, regionRepository: RegionEntity): Promise<RegionEntity> {
        const persistedRegion: RegionEntity = await this.regionRepository.findOne({ where: { id } });
        if (!persistedRegion) {
            throw new BusinessLogicException("The Region with the given id was not found", BusinessError.NOT_FOUND);
        }

        return await this.regionRepository.save({ ...persistedRegion, ...regionRepository });
    }

    async delete(id: string) {
        const culturagastronomica: RegionEntity = await this.regionRepository.findOne({ where: { id } });
        if (!culturagastronomica) {
            throw new BusinessLogicException("The Region with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.regionRepository.remove(culturagastronomica);
    }
}
