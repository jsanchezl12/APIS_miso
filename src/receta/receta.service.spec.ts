import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetasList: RecetaEntity[];

  const seedDatabase = async () => {
    repository.clear();
    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save({
        nombre: faker.commerce.productName(),
        proceso: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        urlFotoPlato: faker.image.imageUrl(),
        urlVideoPreparacion: faker.internet.url(),
      });
      recetasList.push(receta);
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
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all recipes', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length);
  });

  it('findOne should return a recipe by id', async () => {
    const storedReceta: RecetaEntity = recetasList[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(storedReceta.nombre);
    expect(receta.proceso).toEqual(storedReceta.proceso);
  });

  it('findOne should throw an exception for an invalid recipe', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('create should return a new recipe', async () => {
    const receta: RecetaEntity = {
      id: '',
      nombre: faker.commerce.productName(),
      proceso: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      urlFotoPlato: faker.image.imageUrl(),
      urlVideoPreparacion: faker.internet.url(),
      culturaGastronomica: null,
      ingredientes: [],
    };
    const newReceta: RecetaEntity = await service.create(receta);
    expect(newReceta).not.toBeNull();
    const storedReceta: RecetaEntity = await repository.findOne({
      where: { id: newReceta.id },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre);
    expect(storedReceta.proceso).toEqual(receta.proceso);
  });

  it('update should modify a recipe', async () => {
    const receta: RecetaEntity = recetasList[0];
    receta.nombre = 'New name';
    receta.proceso = 'New process';
    const updateReceta: RecetaEntity = await service.update(receta.id, receta);
    expect(updateReceta).not.toBeNull();
    const storedReceta: RecetaEntity = await repository.findOne({
      where: { id: receta.id },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre);
    expect(storedReceta.proceso).toEqual(receta.proceso);
  });

  it('update should throw an exception for an invalid recipe', async () => {
    let receta: RecetaEntity = recetasList[0];
    receta = {
      ...receta,
      nombre: 'New name',
      proceso: 'New process',
      descripcion: 'New description',
    };
    await expect(() => service.update('0', receta)).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('delete should remove a recipe', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
    const deletedReceta: RecetaEntity = await repository.findOne({
      where: { id: receta.id },
    });
    expect(deletedReceta).toBeNull();
  });

  it('delete should throw an exception for an invalid recipe', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });
});
