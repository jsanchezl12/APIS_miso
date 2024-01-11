import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisList: PaisEntity[];

  const seedDatabase = async () => {
    repository.clear();
    paisList = [];
    for (let i = 0; i < 5; i++) {
      const paisEntity: PaisEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
      paisList.push(paisEntity);
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
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Paises', async () => {
    const pais: PaisEntity[] = await service.findAll();
    expect(pais).not.toBeNull();
    expect(pais).toHaveLength(paisList.length);
  });

  it('findOne should return a Paises by id', async () => {
    const storedPais: PaisEntity = paisList[1];
    const pais: PaisEntity = await service.findOne(storedPais.id);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(storedPais.nombre);
    expect(pais.descripcion).toEqual(storedPais.descripcion);
  });

  it('findOne should throw an exception for an invalid Paises', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The Pais with the given id was not found',
    );
  });

  it('create should return a new Paises', async () => {
    const pais: PaisEntity = {
      id: '48a9ab90-1276-11ed-861d-0242ac120003',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      culturasgastronomicas: [],
      regiones: [],
    };
    const newPais: PaisEntity = await service.create(pais);
    expect(newPais).not.toBeNull();
    const storedPais: PaisEntity = await repository.findOne({
      where: { id: newPais.id },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(newPais.nombre);
    expect(storedPais.descripcion).toEqual(newPais.descripcion);
  });

  it('update should modify a Paises', async () => {
    const pais: PaisEntity = paisList[0];
    pais.nombre = 'Colombia';
    pais.descripcion = 'tercer mas hermosos del mundo';
    const updatepais: PaisEntity = await service.update(pais.id, pais);
    expect(updatepais).not.toBeNull();
    const storedPais: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(pais.nombre);
    expect(storedPais.descripcion).toEqual(pais.descripcion);
  });

  it('update should throw an exception for an invalid Paises', async () => {
    let pais: PaisEntity = paisList[0];
    pais = {
      ...pais,
      nombre: 'New name',
      descripcion: 'New desc',
    };
    await expect(() => service.update('0', pais)).rejects.toHaveProperty(
      'message',
      'The Pais with the given id was not found',
    );
  });

  it('delete should remove a Paises', async () => {
    const pais: PaisEntity = paisList[0];
    await service.delete(pais.id);
    const deletePais: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(deletePais).toBeNull();
  });

  it('delete should throw an exception for an invalid Paises', async () => {
    const pais: PaisEntity = paisList[0];
    await service.delete(pais.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The Pais with the given id was not found',
    );
  });
});
