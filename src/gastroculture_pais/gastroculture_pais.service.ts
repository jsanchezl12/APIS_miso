import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class GastroculturePaisService {
  constructor(
    @InjectRepository(CulturagastronomicaEntity)
    private readonly gcultureRepository: Repository<CulturagastronomicaEntity>,

    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,
  ) {}

  async addCountryGCulture(
    gcultureId: string,
    paisId: string,
  ): Promise<CulturagastronomicaEntity> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais) {
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['pais'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    gculture.pais = pais;
    return await this.gcultureRepository.save(gculture);
  }

  async findPaisByGCultureIdPaisId(
    gcultureId: string,
    paisId: string,
  ): Promise<PaisEntity> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais) {
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['pais'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    if (!gculture.pais) {
      throw new BusinessLogicException(
        'The gastronomic culture is not associated to a country',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const gculturePais: PaisEntity =
      gculture.pais.id == pais.id ? gculture.pais : null;
    if (!gculturePais) {
      throw new BusinessLogicException(
        'The country with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return gculturePais;
  }

  async findPaisByGCultureId(gcultureId: string): Promise<PaisEntity> {
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['pais'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return gculture.pais;
  }

  async associatePaisGCulture(
    gcultureId: string,
    pais: PaisEntity,
  ): Promise<CulturagastronomicaEntity> {
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['pais'],
      });

    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const country: PaisEntity = await this.paisRepository.findOne({
      where: { id: pais.id },
    });
    if (!country) {
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    gculture.pais = country;
    return await this.gcultureRepository.save(gculture);
  }

  async deletePaisGCulture(gcultureId: string, paisId: string) {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais) {
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['pais'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    if (!gculture.pais) {
      throw new BusinessLogicException(
        'The country with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    gculture.pais = null;
    await this.gcultureRepository.save(gculture);
  }
}
