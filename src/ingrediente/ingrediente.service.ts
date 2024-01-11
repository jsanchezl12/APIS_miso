/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredienteEntity } from './ingrediente.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class IngredienteService {

  cacheKey: string = "ingredientes"; 

  constructor(
    @InjectRepository(IngredienteEntity)
    private readonly ingredienteRepository: Repository<IngredienteEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<IngredienteEntity[]> {
    const cached: IngredienteEntity[] = await this.cacheManager.get<IngredienteEntity[]>(this.cacheKey);
      
    if(!cached){
        const ingredientes: IngredienteEntity[] = await this.ingredienteRepository.find({ relations: ["ingredientes"] });
        await this.cacheManager.set(this.cacheKey, ingredientes);
        return ingredientes;
    }
    return cached;
  }
  async findOne(id: string): Promise<IngredienteEntity> {
    const ingrediente: IngredienteEntity =
      await this.ingredienteRepository.findOne({
        where: { id },
      });
    if (!ingrediente)
      throw new BusinessLogicException(
        'The ingredient with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return ingrediente;
  }
  async create(ingrediente: IngredienteEntity): Promise<IngredienteEntity> {
    return await this.ingredienteRepository.save(ingrediente);
  }
  async update(
    id: string,
    ingredienteRepository: IngredienteEntity,
  ): Promise<IngredienteEntity> {
    const persistedIngrediente: IngredienteEntity =
      await this.ingredienteRepository.findOne({ where: { id } });
    if (!persistedIngrediente)
      throw new BusinessLogicException(
        'The ingredient with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.ingredienteRepository.save({
      ...persistedIngrediente,
      ...ingredienteRepository,
    });
  }
  async delete(id: string) {
    const ingrediente: IngredienteEntity =
      await this.ingredienteRepository.findOne({ where: { id } });
    if (!ingrediente)
      throw new BusinessLogicException(
        'The ingredient with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.ingredienteRepository.remove(ingrediente);
  }
}
