import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RecetaService {
  cacheKey = 'receta';
  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<RecetaEntity[]> {
    const cached: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(
      this.cacheKey,
    );
    if (!cached) {
      const recetas: RecetaEntity[] = await this.recetaRepository.find({
        relations: ['culturaGastronomica'],
      });
      await this.cacheManager.set(this.cacheKey, recetas);
      return recetas;
    }
    return cached;
  }

  async findOne(id: string): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
      relations: ['culturaGastronomica'],
    });
    if (!receta) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return receta;
  }

  async create(receta: RecetaEntity): Promise<RecetaEntity> {
    return await this.recetaRepository.save(receta);
  }

  async update(id: string, recetaData: RecetaEntity): Promise<RecetaEntity> {
    const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!persistedReceta) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return await this.recetaRepository.save({
      ...persistedReceta,
      ...recetaData,
    });
  }

  async delete(id: string) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!receta) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    //await this.recetaRepository.remove(receta);

    try {
      await this.recetaRepository.remove(receta);
      // Devolver una respuesta de éxito
      return {
        message: 'Recipe deleted successfully',
      };
    } catch (error) {
      throw new BusinessLogicException(
        'Failed to delete the recipe. Please try again.',
        BusinessError.FAILED_DELETE,
      );
    }
  }
}
