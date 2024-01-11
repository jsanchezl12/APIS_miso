/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { GastrocultureRecetaService } from './gastroculture_receta.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';


describe('GastrocultureRecetaService', () => {
  let service: GastrocultureRecetaService;
  let gcultureRepository: Repository<CulturagastronomicaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let gculture: CulturagastronomicaEntity;
  let recetas: RecetaEntity[];

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
      providers: [GastrocultureRecetaService],
    }).compile();

    service = module.get<GastrocultureRecetaService>(GastrocultureRecetaService);
    gcultureRepository = module.get<Repository<CulturagastronomicaEntity>>(getRepositoryToken(CulturagastronomicaEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    recetaRepository.clear();
    gcultureRepository.clear();

    recetas = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.commerce.productName(),
        proceso: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        urlFotoPlato: faker.image.imageUrl(),
        urlVideoPreparacion: faker.internet.url(),
      })
      recetas.push(receta);
    }

    gculture = await gcultureRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      recetas: recetas,
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecipeGCulture should add a recipe to a gculture', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.commerce.productName(),
      proceso: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      urlFotoPlato: faker.image.imageUrl(),
      urlVideoPreparacion: faker.internet.url(),
    });
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
    const result: CulturagastronomicaEntity = await service.addRecipeGCulture(newGCulture.id, newReceta.id);
    expect(result.recetas.length).toBe(1);
    expect(result.recetas[0]).not.toBeNull();
    expect(result.recetas[0].nombre).toBe(newReceta.nombre)
    expect(result.recetas[0].proceso).toBe(newReceta.proceso)
    expect(result.recetas[0].descripcion).toBe(newReceta.descripcion)
    expect(result.recetas[0].urlFotoPlato).toBe(newReceta.urlFotoPlato)
    expect(result.recetas[0].urlVideoPreparacion).toBe(newReceta.urlVideoPreparacion)
  });
  it('addRecipeGCulture should thrown exception for an invalid recipe', async () => {
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });

    await expect(() =>
      service.addRecipeGCulture(newGCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });
  it('addRecipeGCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.commerce.productName(),
      proceso: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      urlFotoPlato: faker.image.imageUrl(),
      urlVideoPreparacion: faker.internet.url(),
    });

    await expect(() =>
      service.addRecipeGCulture('0', newReceta.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findRecetaByGCultureIdRecetaId should return recipe by gastronomic culture', async () => {
    const receta: RecetaEntity = recetas[0];
    const storedReceta: RecetaEntity = await service.findRecetaByGCultureIdRecetaId(gculture.id, receta.id, )
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toBe(receta.nombre)
    expect(storedReceta.proceso).toBe(receta.proceso)
    expect(storedReceta.descripcion).toBe(receta.descripcion)
    expect(storedReceta.urlFotoPlato).toBe(receta.urlFotoPlato)
    expect(storedReceta.urlVideoPreparacion).toBe(receta.urlVideoPreparacion)
  });

  it('findRecetaByGCultureIdRecetaId should throw an exception for an invalid recipe', async () => {
    await expect(()=> service.findRecetaByGCultureIdRecetaId(gculture.id, "0")).rejects.toHaveProperty("message", "The recipe with the given id was not found"); 
  });

  it('findRecetaByGCultureIdRecetaId should throw an exception for an invalid gastronomic culture', async () => {
    const receta: RecetaEntity = recetas[0]; 
    await expect(()=> service.findRecetaByGCultureIdRecetaId("0", receta.id)).rejects.toHaveProperty("message", "The gastronomic culture with the given id was not found"); 
  });

  it('findRecetaByGCultureIdRecetaId should throw an exception for a recipe not associated to the gastronomic culture', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.commerce.productName(),
      proceso: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      urlFotoPlato: faker.image.imageUrl(),
      urlVideoPreparacion: faker.internet.url(),
    });

    await expect(()=> service.findRecetaByGCultureIdRecetaId(gculture.id, newReceta.id)).rejects.toHaveProperty("message", "The recipe with the given id is not associated to the gastronomic culture"); 
  });

  it('findRecetaByGCultureId should return recipes by gastronomic culture', async ()=>{
    const recetas: RecetaEntity[] = await service.findRecetaByGCultureId(gculture.id);
    expect(recetas.length).toBe(5)
  });

  it('findRecetaByGCultureId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(()=> service.findRecetaByGCultureId("0")).rejects.toHaveProperty("message", "The gastronomic culture with the given id was not found"); 
  });

  it('associateRecipeGCulture should update recipes list for a gastronomic culture', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.commerce.productName(),
      proceso: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      urlFotoPlato: faker.image.imageUrl(),
      urlVideoPreparacion: faker.internet.url(),
    });

    const updatedGCulture: CulturagastronomicaEntity = await service.associateRecipeGCulture(gculture.id, [newReceta]);
    expect(updatedGCulture.recetas.length).toBe(1);
    expect(updatedGCulture.recetas[0]).not.toBeNull();
    expect(updatedGCulture.recetas[0].nombre).toBe(newReceta.nombre)
    expect(updatedGCulture.recetas[0].proceso).toBe(newReceta.proceso)
    expect(updatedGCulture.recetas[0].descripcion).toBe(newReceta.descripcion)
    expect(updatedGCulture.recetas[0].urlFotoPlato).toBe(newReceta.urlFotoPlato)
    expect(updatedGCulture.recetas[0].urlVideoPreparacion).toBe(newReceta.urlVideoPreparacion)
  });

  it('associateRecipeGCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.commerce.productName(),
      proceso: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      urlFotoPlato: faker.image.imageUrl(),
      urlVideoPreparacion: faker.internet.url(),
    });

    await expect(()=> service.associateRecipeGCulture("0", [newReceta])).rejects.toHaveProperty("message", "The gastronomic culture with the given id was not found"); 
  });

  it('associateRecipeGCulture should throw an exception for an invalid recipe', async () => {
    const newReceta: RecetaEntity = recetas[0];
    newReceta.id = "0";

    await expect(()=> service.associateRecipeGCulture(gculture.id, [newReceta])).rejects.toHaveProperty("message", "The recipe with the given id was not found"); 
  });

  it('deleteRecetaGCulture should remove an recipe from a gastronomic culture', async () => {
    const receta: RecetaEntity = recetas[0];
    await service.deleteRecetaGCulture(gculture.id, receta.id);
    const storedGCulture: CulturagastronomicaEntity = await gcultureRepository.findOne({where: {id: gculture.id}, relations: ["recetas"]});
    const deletedReceta: RecetaEntity = storedGCulture.recetas.find(a => a.id === receta.id);
    expect(deletedReceta).toBeUndefined();

  });

  it('deleteRecetaGCulture should thrown an exception for an invalid recipe', async () => {
    await expect(()=> service.deleteRecetaGCulture(gculture.id, "0")).rejects.toHaveProperty("message", "The recipe with the given id was not found"); 
  });

  it('deleteRecetaGCulture should thrown an exception for an invalid gastronomic culture', async () => {
    const receta: RecetaEntity = recetas[0];
    await expect(()=> service.deleteRecetaGCulture("0", receta.id)).rejects.toHaveProperty("message", "The gastronomic culture with the given id was not found"); 
  });

  it('deleteRecetaGCulture should thrown an exception for an non asocciated recipe', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.commerce.productName(),
      proceso: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      urlFotoPlato: faker.image.imageUrl(),
      urlVideoPreparacion: faker.internet.url(),
    });

    await expect(()=> service.deleteRecetaGCulture(gculture.id, newReceta.id)).rejects.toHaveProperty("message", "The recipe with the given id is not associated to the gastronomic culture"); 
  }); 
});
