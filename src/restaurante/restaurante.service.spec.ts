/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity } from './restaurante.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';


describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restaurantesList: RestauranteEntity[];

  const seedDatabase = async () => {
    repository.clear();
    restaurantesList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity =
        await repository.save({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          numberStars: faker.fake.length,
          date: faker.date.recent(),
        });
        restaurantesList.push(restaurante);
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
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(
      RestauranteService,
    );
    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurant', async () => {
    const restaurante: RestauranteEntity[] =
      await service.findAll();
    expect(restaurante).not.toBeNull();
    expect(restaurante).toHaveLength(restaurantesList.length);
  });

  it('findOne should return a restaurant by id', async () => {
    const storedRestaurante: RestauranteEntity =
    restaurantesList[0];
    const restaurante: RestauranteEntity =
      await service.findOne(storedRestaurante.id);
    expect(restaurante).not.toBeNull();
    expect(restaurante.name).toEqual(
      storedRestaurante.name,
    );
    expect(restaurante.description).toEqual(
      storedRestaurante.description,
    );
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('create should return a new restaurant', async () => {
    const restaurante: RestauranteEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      numberStars: 0,
      date: faker.date.recent(),
      culturasgastronomicas: [],
    };
    const newRestaurante: RestauranteEntity =
      await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();
    const storedRestaurante: RestauranteEntity =
      await repository.findOne({
        where: { id: newRestaurante.id },
      });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.name).toEqual(
      storedRestaurante.name,
    );
    expect(storedRestaurante.description).toEqual(
      storedRestaurante.description,
    );
  });

  it('update should modify a restaurante', async () => {
    const restaurante: RestauranteEntity =
      restaurantesList[0];
    restaurante.name = 'New name';
    restaurante.description = 'New desc';
    const updateRestaurante: RestauranteEntity =
      await service.update(restaurante.id, restaurante);
    expect(updateRestaurante).not.toBeNull();
    const storedRestaurante: RestauranteEntity =
      await repository.findOne({
        where: { id: restaurante.id },
      });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.name).toEqual(
      restaurante.name,
    );
    expect(storedRestaurante.description).toEqual(
      restaurante.description,
    );
  });

  it('update should throw an exception for an invalid restaurant', async () => {
    let restaurante: RestauranteEntity =
      restaurantesList[0];
    restaurante = {
      ...restaurante,
      name: 'New name',
      description: 'New desc',
      numberStars: 3,
    };
    await expect(() =>
      service.update('0', restaurante),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('delete should remove a restaurant', async () => {
    const restaurante: RestauranteEntity =
      restaurantesList[0];
    await service.delete(restaurante.id);
    const deletedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: restaurante.id },
    });
    expect(deletedRestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurant', async () => {
    const restaurante: RestauranteEntity =
      restaurantesList[0];
    await service.delete(restaurante.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });
});

