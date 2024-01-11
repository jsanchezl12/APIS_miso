import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { GastroculturePaisService } from './gastroculture_pais.service';

describe('GastroculturePaisService', () => {
  let service: GastroculturePaisService;
  let gcultureRepository: Repository<CulturagastronomicaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let gculture: CulturagastronomicaEntity;
  let pais: PaisEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GastroculturePaisService],
    }).compile();
    service = module.get<GastroculturePaisService>(GastroculturePaisService);
    gcultureRepository = module.get<Repository<CulturagastronomicaEntity>>(
      getRepositoryToken(CulturagastronomicaEntity),
    );
    paisRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    gcultureRepository.clear();
    paisRepository.clear();
    pais = await paisRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });
    gculture = await gcultureRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      pais: pais,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCountryGCulture should add an country to a gculture', async () => {
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });
    const result: CulturagastronomicaEntity = await service.addCountryGCulture(
      newGCulture.id,
      newPais.id,
    );
    expect(result).not.toBeNull();
    expect(result.pais).not.toBeNull();
    expect(result.pais.nombre).toBe(newPais.nombre);
    expect(result.pais.descripcion).toBe(newPais.descripcion);
  });

  it('addCountryGCulture should thrown exception for an invalid country', async () => {
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
    await expect(() =>
      service.addCountryGCulture(newGCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('addCountryGCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addCountryGCulture('0', newPais.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findPaisByGCultureIdPaisId should return country by gastronomic culture', async () => {
    const storedPais: PaisEntity = await service.findPaisByGCultureIdPaisId(
      gculture.id,
      pais.id,
    );
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toBe(pais.nombre);
    expect(storedPais.descripcion).toBe(pais.descripcion);
  });

  it('findPaisByGCultureIdPaisId should throw an exception for an invalid country', async () => {
    await expect(() =>
      service.findPaisByGCultureIdPaisId(gculture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('findPaisByGCultureIdPaisId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() =>
      service.findPaisByGCultureIdPaisId('0', pais.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findPaisByGCultureIdPaisId should throw an exception for an country not associated to the gastronomic culture', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });
    await expect(() =>
      service.findPaisByGCultureIdPaisId(gculture.id, newPais.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id is not associated to the gastronomic culture',
    );
  });

  it('findPaisByGCultureId should return country by gastronomic culture', async () => {
    const pais: PaisEntity = await service.findPaisByGCultureId(gculture.id);
    expect(pais).not.toBeNull();
  });

  it('findPaisByGCultureId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() =>
      service.findPaisByGCultureId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associatePaisGCulture should update country for a gastronomic culture', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });
    const updatedGCulture: CulturagastronomicaEntity =
      await service.associatePaisGCulture(gculture.id, newPais);
    expect(updatedGCulture).not.toBeNull();
    expect(updatedGCulture.pais).not.toBeNull();
    expect(updatedGCulture.pais.nombre).toBe(newPais.nombre);
    expect(updatedGCulture.pais.descripcion).toBe(newPais.descripcion);
  });

  it('associatePaisGCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });
    await expect(() =>
      service.associatePaisGCulture('0', newPais),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associatePaisGCulture should throw an exception for an invalid country', async () => {
    const newPais: PaisEntity = pais;
    newPais.id = '0';
    await expect(() =>
      service.associatePaisGCulture(gculture.id, newPais),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('deletePaisGCulture should remove an country from a gastronomic culture', async () => {
    const newPais: PaisEntity = pais;
    await service.deletePaisGCulture(gculture.id, newPais.id);
    const storedGCulture: CulturagastronomicaEntity =
      await gcultureRepository.findOne({
        where: { id: gculture.id },
        relations: ['pais'],
      });
    const deletedPais: PaisEntity = storedGCulture.pais;
    expect(deletedPais).toBeNull();
  });

  it('deletePaisGCulture should thrown an exception for an invalid country', async () => {
    await expect(() =>
      service.deletePaisGCulture(gculture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('deletePaisGCulture should thrown an exception for an invalid gastronomic culture', async () => {
    const newPais: PaisEntity = pais;
    await expect(() =>
      service.deletePaisGCulture('0', newPais.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('deletePaisGCulture should thrown an exception for an non asocciated country', async () => {
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.deletePaisGCulture(newGCulture.id, newPais.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id is not associated to the gastronomic culture',
    );
  });
});
