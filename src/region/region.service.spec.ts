import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RegionService } from './region.service';
import { RegionEntity } from './region.entity';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';

describe('RegionService', () => {
  let service: RegionService;
  let repository: Repository<RegionEntity>;
  let regionList: RegionEntity[];

  const seedDatabase = async () => {
    repository.clear();
    regionList = [];
    for (let i = 0; i < 5; i++) {
      const regionEntity: RegionEntity = await repository.save({
        nombre: faker.company.name(),
        estado: faker.company.catchPhraseAdjective(),
        descripcion: faker.lorem.sentence(),
      });
      regionList.push(regionEntity);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmTestingConfig(),
        CacheModule.register({
          store: sqliteStore,
          path: ':memory:',
          options: {
            ttl: 2,
          },
        }),
      ],
      providers: [RegionService],
    }).compile();

    service = module.get<RegionService>(RegionService);
    repository = module.get<Repository<RegionEntity>>(
      getRepositoryToken(RegionEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Regiones', async () => {
    const region: RegionEntity[] = await service.findAll();
    expect(region).not.toBeNull();
    expect(region).toHaveLength(regionList.length);
  });

  it('findOne should return a Region by id', async () => {
    const storedRegion: RegionEntity = regionList[1];
    const region: RegionEntity = await service.findOne(storedRegion.id);
    expect(region).not.toBeNull();
    expect(region.nombre).toEqual(storedRegion.nombre);
    expect(region.descripcion).toEqual(storedRegion.descripcion);
  });

  it('findOne should throw an exception for an invalid Region', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The Region with the given id was not found',
    );
  });

  it('create should return a new Region', async () => {
    const region: RegionEntity = {
      id: '48a9ab90-1276-11ed-861d-0242ac120003',
      nombre: faker.company.name(),
      estado: faker.animal.bear(),
      descripcion: faker.lorem.sentence(),
      pais: null,
    };
    const newRegion: RegionEntity = await service.create(region);
    expect(newRegion).not.toBeNull();
    const storedRegion: RegionEntity = await repository.findOne({
      where: { id: newRegion.id },
    });
    expect(storedRegion).not.toBeNull();
    expect(storedRegion.nombre).toEqual(newRegion.nombre);
    expect(storedRegion.descripcion).toEqual(newRegion.descripcion);
  });

  it('update should modify a Region', async () => {
    const region: RegionEntity = regionList[0];
    region.nombre = 'Andina';
    region.estado = 'Caldas';
    region.descripcion = 'Esta el nevado del Reuis en caldas';
    const updateRegion: RegionEntity = await service.update(region.id, region);
    expect(updateRegion).not.toBeNull();
    const storedRegion: RegionEntity = await repository.findOne({
      where: { id: region.id },
    });
    expect(storedRegion).not.toBeNull();
    expect(storedRegion.nombre).toEqual(region.nombre);
    expect(storedRegion.descripcion).toEqual(region.descripcion);
  });

  it('update should throw an exception for an invalid Region', async () => {
    let Region: RegionEntity = regionList[0];
    Region = {
      ...Region,
      nombre: 'New name',
      estado: 'New state',
      descripcion: 'New desc',
    };
    await expect(() => service.update('0', Region)).rejects.toHaveProperty(
      'message',
      'The Region with the given id was not found',
    );
  });

  it('delete should remove a Region', async () => {
    const region: RegionEntity = regionList[2];
    await service.delete(region.id);
    const deleteRegion: RegionEntity = await repository.findOne({
      where: { id: region.id },
    });
    expect(deleteRegion).toBeNull();
  });

  it('delete should throw an exception for an invalid Region', async () => {
    const region: RegionEntity = regionList[0];
    await service.delete(region.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The Region with the given id was not found',
    );
  });
});
