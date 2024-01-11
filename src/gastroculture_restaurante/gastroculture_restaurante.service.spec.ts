import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { GastrocultureRestauranteService } from './gastroculture_restaurante.service';

describe('GastrocultureRestauranteService', () => {
  let service: GastrocultureRestauranteService;
  let gcultureRepository: Repository<CulturagastronomicaEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let gculture: CulturagastronomicaEntity;
  let restaurante: RestauranteEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GastrocultureRestauranteService],
    }).compile();

    service = module.get<GastrocultureRestauranteService>(
      GastrocultureRestauranteService,
    );
    gcultureRepository = module.get<Repository<CulturagastronomicaEntity>>(
      getRepositoryToken(CulturagastronomicaEntity),
    );
    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    gcultureRepository.clear();
    restauranteRepository.clear();

    restaurante = await restauranteRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      numberStars: faker.fake.length,
      date: faker.date.recent(),
    });

    gculture = await gcultureRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      restaurante: restaurante,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestaurantGCulture should add an restaurant to a gculture', async () => {
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      numberStars: faker.fake.length,
      date: faker.date.recent(),
    });
    const result: CulturagastronomicaEntity =
      await service.addRestaurantGCulture(newGCulture.id, newRestaurante.id);

    expect(result).not.toBeNull();
    expect(result.restaurante).not.toBeNull();
    expect(result.restaurante.name).toBe(newRestaurante.name);
    expect(result.restaurante.description).toBe(newRestaurante.description);
    expect(result.restaurante.numberStars).toBe(
      newRestaurante.numberStars,
    );
    expect(result.restaurante.date.toISOString()).toBe(
      newRestaurante.date.toISOString(),
    );
  });

  it('addRestaurantGCulture should thrown exception for an invalid restaurant', async () => {
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });

    await expect(() =>
      service.addRestaurantGCulture(newGCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('addRestaurantGCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      numberStars: faker.fake.length,
      date: faker.date.recent(),
    });

    await expect(() =>
      service.addRestaurantGCulture('0', newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });
  it('findRestauranteByGCultureIdResutaranteId should return restaurant by gastronomic culture', async () => {
    const storedRestaurante: RestauranteEntity =
      await service.findRestauranteByGCultureIdRestauranteId(
        gculture.id,
        restaurante.id,
      );
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.name).toBe(restaurante.name);
    expect(storedRestaurante.description).toBe(restaurante.description);
    expect(storedRestaurante.numberStars).toBe(restaurante.numberStars);
    expect(storedRestaurante.date.toISOString()).toBe(
      restaurante.date.toISOString(),
    );
  });
  it('findRestauranteByGCultureIdResutaranteId should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.findRestauranteByGCultureIdRestauranteId(gculture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });
  it('findRestauranteByGCultureIdResutaranteId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() =>
      service.findRestauranteByGCultureIdRestauranteId('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });
  it('findRestauranteByGCultureIdResutaranteId should throw an exception for an restaurant not associated to the gastronomic culture', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      numberStars: faker.fake.length,
      date: faker.date.recent(),
    });

    await expect(() =>
      service.findRestauranteByGCultureIdRestauranteId(
        gculture.id,
        newRestaurante.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id is not associated to the gastronomic culture',
    );
  });
  it('findRestauranteByGCultureId should return restaurante by gastronomic culture', async () => {
    const restaurante: RestauranteEntity =
      await service.findRestauranteByGCultureId(gculture.id);
    expect(restaurante).not.toBeNull();
  });
  it('findRestauranteByGCultureId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() =>
      service.findRestauranteByGCultureId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });
  it('associateRestaurantGCulture should update restaurant for a gastronomic culture', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      numberStars: faker.fake.length,
      date: faker.date.recent(),
    });

    const updatedGCulture: CulturagastronomicaEntity =
      await service.associateRestaurantGCulture(gculture.id, newRestaurante);
    expect(updatedGCulture).not.toBeNull();
    expect(updatedGCulture.restaurante).not.toBeNull();
    expect(updatedGCulture.restaurante.name).toBe(newRestaurante.name);
    expect(updatedGCulture.restaurante.description).toBe(
      newRestaurante.description,
    );
    expect(updatedGCulture.restaurante.numberStars).toBe(
      newRestaurante.numberStars,
    );
    expect(updatedGCulture.restaurante.date.toISOString()).toBe(
      newRestaurante.date.toISOString(),
    );
  });
  it('associateRestaurantGCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      numberStars: faker.fake.length,
      date: faker.date.recent(),
    });

    await expect(() =>
      service.associateRestaurantGCulture('0', newRestaurante),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associateRestaurantGCulture should throw an exception for an invalid restaurant', async () => {
    const newRestaurante: RestauranteEntity = restaurante;
    newRestaurante.id = '0';
    await expect(() =>
      service.associateRestaurantGCulture(gculture.id, newRestaurante),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });
  it('deleteRestauranteGCulture should remove an restaurant from a gastronomic culture', async () => {
    const restaurant: RestauranteEntity = restaurante;
    await service.deleteRestauranteGCulture(gculture.id, restaurant.id);
    const storedGCulture: CulturagastronomicaEntity =
      await gcultureRepository.findOne({
        where: { id: gculture.id },
        relations: ['restaurante'],
      });
    const deletedRestaurante: RestauranteEntity = storedGCulture.restaurante;
    expect(deletedRestaurante).toBeNull();
  });

  it('deleteRestauranteGCulture should thrown an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.deleteRestauranteGCulture(gculture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('deleteRestauranteGCulture should thrown an exception for an invalid gastronomic culture', async () => {
    const restaurant: RestauranteEntity = restaurante;
    await expect(() =>
      service.deleteRestauranteGCulture('0', restaurant.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('deleteRestauranteGCulture should thrown an exception for an non asocciated restaurant', async () => {
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      numberStars: faker.fake.length,
      date: faker.date.recent(),
    });

    await expect(() =>
      service.deleteRestauranteGCulture(newGCulture.id, newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id is not associated to the gastronomic culture',
    );
  });
});
