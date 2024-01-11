/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturagastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaService } from './culturagastronomica.service';
import { faker } from '@faker-js/faker';
import { ProductoEntity } from '../producto/producto.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';


describe('CulturagastronomicaService', () => {
  let service: CulturagastronomicaService;
  let repository: Repository<CulturagastronomicaEntity>;
  let culturagastronomicasList: CulturagastronomicaEntity[];

  const seedDatabase = async () => {
    repository.clear();
    culturagastronomicasList = [];
    for (let i = 0; i < 5; i++) {
      const culturagastronomica: CulturagastronomicaEntity =
        await repository.save({
          nombre: faker.company.name(),
          descripcion: faker.lorem.sentence(),
        });
      culturagastronomicasList.push(culturagastronomica);
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
        })
      ],
      providers: [
        CulturagastronomicaService,
      ],
    }).compile();

    service = module.get<CulturagastronomicaService>(
      CulturagastronomicaService,
    );
    repository = module.get<Repository<CulturagastronomicaEntity>>(
      getRepositoryToken(CulturagastronomicaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all gastronomic cultures', async () => {
    const culturagastronomicas: CulturagastronomicaEntity[] =
      await service.findAll();
    expect(culturagastronomicas).not.toBeNull();
    expect(culturagastronomicas).toHaveLength(culturagastronomicasList.length);
  });

  it('findOne should return a gastronomic culture by id', async () => {
    const storedCulturagastronomica: CulturagastronomicaEntity =
      culturagastronomicasList[0];
    const culturagastronomica: CulturagastronomicaEntity =
      await service.findOne(storedCulturagastronomica.id);
    expect(culturagastronomica).not.toBeNull();
    expect(culturagastronomica.nombre).toEqual(
      storedCulturagastronomica.nombre,
    );
    expect(culturagastronomica.descripcion).toEqual(
      storedCulturagastronomica.descripcion,
    );
  });

  it('findOne should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('create should return a new gastronomic culture', async () => {
    const culturagastronomica: CulturagastronomicaEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      restaurante: null,
      pais: null,
      recetas: [],
      producto: new ProductoEntity(),
    };
    const newCulturagastronomica: CulturagastronomicaEntity =
      await service.create(culturagastronomica);
    expect(newCulturagastronomica).not.toBeNull();
    const storedCulturagastronomica: CulturagastronomicaEntity =
      await repository.findOne({
        where: { id: newCulturagastronomica.id },
      });
    expect(storedCulturagastronomica).not.toBeNull();
    expect(storedCulturagastronomica.nombre).toEqual(
      storedCulturagastronomica.nombre,
    );
    expect(storedCulturagastronomica.descripcion).toEqual(
      storedCulturagastronomica.descripcion,
    );
  });

  it('update should modify a gastronomic culture', async () => {
    const culturagastronomica: CulturagastronomicaEntity =
      culturagastronomicasList[0];
    culturagastronomica.nombre = 'New name';
    culturagastronomica.descripcion = 'New desc';
    const updateCulturagastronomica: CulturagastronomicaEntity =
      await service.update(culturagastronomica.id, culturagastronomica);
    expect(updateCulturagastronomica).not.toBeNull();
    const storedCulturagastronomica: CulturagastronomicaEntity =
      await repository.findOne({
        where: { id: culturagastronomica.id },
      });
    expect(storedCulturagastronomica).not.toBeNull();
    expect(storedCulturagastronomica.nombre).toEqual(
      culturagastronomica.nombre,
    );
    expect(storedCulturagastronomica.descripcion).toEqual(
      culturagastronomica.descripcion,
    );
  });

  it('update should throw an exception for an invalid gastronomic culture', async () => {
    let culturagastronomica: CulturagastronomicaEntity =
      culturagastronomicasList[0];
    culturagastronomica = {
      ...culturagastronomica,
      nombre: 'New name',
      descripcion: 'New desc',
    };
    await expect(() =>
      service.update('0', culturagastronomica),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('delete should remove a gastronomic culture', async () => {
    const culturagastronomica: CulturagastronomicaEntity =
      culturagastronomicasList[0];
    await service.delete(culturagastronomica.id);
    const deletedMuseum: CulturagastronomicaEntity = await repository.findOne({
      where: { id: culturagastronomica.id },
    });
    expect(deletedMuseum).toBeNull();
  });

  it('delete should throw an exception for an invalid gastronomic culture', async () => {
    const culturagastronomica: CulturagastronomicaEntity =
      culturagastronomicasList[0];
    await service.delete(culturagastronomica.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });
});
