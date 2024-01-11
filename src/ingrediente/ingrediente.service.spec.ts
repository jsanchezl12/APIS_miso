/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { IngredienteService } from './ingrediente.service';
import { IngredienteEntity } from './ingrediente.entity';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';

describe('IngredienteService', () => {
  let service: IngredienteService;
  let repository: Repository<IngredienteEntity>;
  let ingredientesList: IngredienteEntity[];

  const seedDatabase = async () => {
    repository.clear();
    ingredientesList = [];
    for (let i = 0; i < 5; i++) {
      const ingrediente: IngredienteEntity =
        await repository.save({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          count: faker.datatype.number(),
        });
      ingredientesList.push(ingrediente);
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
      providers: [IngredienteService],
    }).compile();

    service = module.get<IngredienteService>(
      IngredienteService,
    );
    repository = module.get<Repository<IngredienteEntity>>(
      getRepositoryToken(IngredienteEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all ingredients', async () => {
    const ingredientes: IngredienteEntity[] =
      await service.findAll();
    expect(ingredientes).not.toBeNull();
    expect(ingredientes).toHaveLength(ingredientesList.length);
  });

  it('findOne should return a ingredient by id', async () => {
    const storedIngrediente: IngredienteEntity =
    ingredientesList[0];
    const ingrediente: IngredienteEntity =
      await service.findOne(storedIngrediente.id);
    expect(ingrediente).not.toBeNull();
    expect(ingrediente.name).toEqual(
      storedIngrediente.name,
    );
    expect(ingrediente.description).toEqual(
      storedIngrediente.description,
    );
  });

  it('findOne should throw an exception for an invalid ingredient', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The ingredient with the given id was not found',
    );
  });

  it('create should return a new ingredient', async () => {
    const ingrediente: IngredienteEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      count: 0,
      ingredientes: [],
    };
  
    const newIngrediente: IngredienteEntity = await service.create(ingrediente);
    expect(newIngrediente).not.toBeNull();
  
    const storedIngrediente: IngredienteEntity = await repository.findOne({
      where: { id: newIngrediente.id },
    });
    expect(storedIngrediente).not.toBeNull();
    expect(storedIngrediente.name).toEqual(ingrediente.name);
    expect(storedIngrediente.description).toEqual(ingrediente.description);
  });

  it('update should modify a ingredient', async () => {
    const ingrediente: IngredienteEntity =
      ingredientesList[0];
    ingrediente.name = 'New name';
    ingrediente.description = 'New desc';
    const updateIngrediente: IngredienteEntity =
      await service.update(ingrediente.id, ingrediente);
    expect(updateIngrediente).not.toBeNull();
    const storedIngrediente: IngredienteEntity =
      await repository.findOne({
        where: { id: ingrediente.id },
      });
    expect(storedIngrediente).not.toBeNull();
    expect(storedIngrediente.name).toEqual(
      ingrediente.name,
    );
    expect(storedIngrediente.description).toEqual(
      ingrediente.description,
    );
  });

  it('update should throw an exception for an invalid ingredient', async () => {
    let ingrediente: IngredienteEntity =
      ingredientesList[0];
    ingrediente = {
      ...ingrediente,
      name: 'New name',
      description: 'New desc',
    };
    await expect(() =>
      service.update('0', ingrediente),
    ).rejects.toHaveProperty(
      'message',
      'The ingredient with the given id was not found',
    );
  });

  it('delete should remove a ingredient', async () => {
    const ingrediente: IngredienteEntity =
      ingredientesList[0];
    await service.delete(ingrediente.id);
    const deletedIngrediente: IngredienteEntity = await repository.findOne({
      where: { id: ingrediente.id },
    });
    expect(deletedIngrediente).toBeNull();
  });

  it('delete should throw an exception for an invalid ingredient', async () => {
    const ingrediente: IngredienteEntity =
      ingredientesList[0];
    await service.delete(ingrediente.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The ingredient with the given id was not found',
    );
  });
});
