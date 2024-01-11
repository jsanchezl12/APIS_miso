/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class GastrocultureRecetaService {
  cacheKey = "gastroculture_receta";
  constructor(
    @InjectRepository(CulturagastronomicaEntity)
    private readonly gcultureRepository: Repository<CulturagastronomicaEntity>,

    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) { }

  async addRecipeGCulture(
    gcultureId: string,
    recetaId: string,
  ): Promise<CulturagastronomicaEntity> {
    const receta: RecetaEntity =
      await this.recetaRepository.findOne({
        where: { id: recetaId },
      });
    if (!receta) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['recetas'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    gculture.recetas = [...gculture.recetas, receta];
    return await this.gcultureRepository.save(gculture);
  }

  async findRecetaByGCultureIdRecetaId(
    gcultureId: string,
    recetaId: string,
  ): Promise<RecetaEntity> {
    const receta: RecetaEntity =
      await this.recetaRepository.findOne({
        where: { id: recetaId },
      });
    if (!receta) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['recetas'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gcultureReceta: RecetaEntity = gculture.recetas.find(e => e.id === receta.id);
    if (!gcultureReceta) {
      throw new BusinessLogicException("The recipe with the given id is not associated to the gastronomic culture", BusinessError.PRECONDITION_FAILED)
    }
    return gcultureReceta;
  }

  async findRecetaByGCultureId(
    gcultureId: string,
  ): Promise<RecetaEntity[]> {
    const cached: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(this.cacheKey);
    if (!cached) {
      const gculture: CulturagastronomicaEntity =
        await this.gcultureRepository.findOne({
          where: { id: gcultureId },
          relations: ['recetas'],
        });
      if (!gculture) {
        throw new BusinessLogicException(
          'The gastronomic culture with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
      await this.cacheManager.set(this.cacheKey, gculture.recetas);
      return gculture.recetas;
    }
    return cached;
  }

  async associateRecipeGCulture(
    gcultureId: string,
    recetas: RecetaEntity[],
  ): Promise<CulturagastronomicaEntity> {
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['recetas'],
      });

    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    for (const recetaItem of recetas) {
      const receta: RecetaEntity = await this.recetaRepository.findOne({
        where: { id: recetaItem.id },
      });
    
      if (!receta) {
        throw new BusinessLogicException(
          'The recipe with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
    }
    gculture.recetas = recetas;
    return await this.gcultureRepository.save(gculture);
  }

  async deleteRecetaGCulture(gcultureId: string, recetaId: string) {
    const receta: RecetaEntity =
      await this.recetaRepository.findOne({
        where: { id: recetaId },
      });
    if (!receta) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['recetas'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gcultureReceta: RecetaEntity = gculture.recetas.find(e => e.id === receta.id);
    if (!gcultureReceta) {
      throw new BusinessLogicException(
        'The recipe with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    gculture.recetas = gculture.recetas.filter(e => e.id !== recetaId);;
    await this.gcultureRepository.save(gculture);
  }
}
