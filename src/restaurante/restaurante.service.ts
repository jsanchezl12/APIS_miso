/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RestauranteService {

  cacheKey: string = "restaurantes"; 

  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<RestauranteEntity[]> {
    const cached: RestauranteEntity[] = await this.cacheManager.get<RestauranteEntity[]>(this.cacheKey);
      
    if(!cached){
        const restaurantes: RestauranteEntity[] = await this.restauranteRepository.find({ relations: ["culturasgastronomicas"] });
        await this.cacheManager.set(this.cacheKey, restaurantes);
        return restaurantes;
    }
    return cached;
  }
  async findOne(id: string): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id },
        relations: ['culturasgastronomicas'],
      });
    if (!restaurante)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return restaurante;
  }
  async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    return await this.restauranteRepository.save(restaurante);
  }
  async update(
    id: string,
    restauranteRepository: RestauranteEntity,
  ): Promise<RestauranteEntity> {
    const persistedRestaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({ where: { id } });
    if (!persistedRestaurante)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.restauranteRepository.save({
      ...persistedRestaurante,
      ...restauranteRepository,
    });
  }
  async delete(id: string) {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({ where: { id } });
    if (!restaurante)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.restauranteRepository.remove(restaurante);
  }
}
