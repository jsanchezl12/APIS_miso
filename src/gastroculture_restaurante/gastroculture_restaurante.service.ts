import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class GastrocultureRestauranteService {
  constructor(
    @InjectRepository(CulturagastronomicaEntity)
    private readonly gcultureRepository: Repository<CulturagastronomicaEntity>,

    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
  ) {}

  async addRestaurantGCulture(
    gcultureId: string,
    restauranteId: string,
  ): Promise<CulturagastronomicaEntity> {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: restauranteId },
      });
    if (!restaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['restaurante'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    gculture.restaurante = restaurante;
    return await this.gcultureRepository.save(gculture);
  }

  async findRestauranteByGCultureIdRestauranteId(
    gcultureId: string,
    restauranteId: string,
  ): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: restauranteId },
      });
    if (!restaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['restaurante'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    if (!gculture.restaurante) {
      throw new BusinessLogicException(
        'The gastronomic culture is not associated to a restaurant',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const gcultureRestaurant: RestauranteEntity =
      gculture.restaurante.id == restaurante.id ? gculture.restaurante : null;
    if (!gcultureRestaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return gcultureRestaurant;
  }

  async findRestauranteByGCultureId(
    gcultureId: string,
  ): Promise<RestauranteEntity> {
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['restaurante'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return gculture.restaurante;
  }

  async associateRestaurantGCulture(
    gcultureId: string,
    restaurant: RestauranteEntity,
  ): Promise<CulturagastronomicaEntity> {
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['restaurante'],
      });

    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: restaurant.id },
      });
    if (!restaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    gculture.restaurante = restaurante;
    return await this.gcultureRepository.save(gculture);
  }

  async deleteRestauranteGCulture(gcultureId: string, restauranteId: string) {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: restauranteId },
      });
    if (!restaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['restaurante'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    if (!gculture.restaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    gculture.restaurante = null;
    await this.gcultureRepository.save(gculture);
  }
}
