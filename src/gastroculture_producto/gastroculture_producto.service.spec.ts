/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { GastrocultureProductoService } from './gastroculture_producto.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';

describe('GastrocultureProductoService', () => {
  let service: GastrocultureProductoService;
  let gcultureRepository: Repository<CulturagastronomicaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let gculture: CulturagastronomicaEntity;
  let producto: ProductoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GastrocultureProductoService],
    }).compile();

    service = module.get<GastrocultureProductoService>(
      GastrocultureProductoService,
    );
    gcultureRepository = module.get<Repository<CulturagastronomicaEntity>>(
      getRepositoryToken(CulturagastronomicaEntity),
    );
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    gcultureRepository.clear();
    productoRepository.clear();

    producto = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      categoria: faker.commerce.department(),
    });

    gculture = await gcultureRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      producto: producto,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductGCulture should add a product to a gculture', async () => {
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      categoria: faker.commerce.department(),
    });
    const result: CulturagastronomicaEntity =
      await service.addProductGCulture(newGCulture.id, newProducto.id);

    expect(result).not.toBeNull();
    expect(result.producto).not.toBeNull();
    expect(result.producto.nombre).toBe(newProducto.nombre);
    expect(result.producto.descripcion).toBe(newProducto.descripcion);
    expect(result.producto.categoria).toBe(newProducto.categoria);
  });

  it('addProductGCulture should thrown exception for an invalid product', async () => {
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });

    await expect(() =>
      service.addProductGCulture(newGCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('addProductGCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      categoria: faker.commerce.department(),
    });

    await expect(() =>
      service.addProductGCulture('0', newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findProductoByGCultureIdProductoId should return product by gastronomic culture', async () => {
    const storedProducto: ProductoEntity =
      await service.findProductoByGCultureIdProductoId(
        gculture.id,
        producto.id,
      );
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.descripcion).toBe(producto.descripcion);
    expect(storedProducto.categoria).toBe(producto.categoria);
  });
  it('findProductoByGCultureIdProductoId should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findProductoByGCultureIdProductoId(gculture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });
  it('findProductoByGCultureIdProductoId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() =>
      service.findProductoByGCultureIdProductoId('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });
  it('findProductoByGCultureIdProductoId should throw an exception for an product not associated to the gastronomic culture', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      categoria: faker.commerce.department(),
    });

    await expect(() =>
      service.findProductoByGCultureIdProductoId(
        gculture.id,
        newProducto.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id is not associated to the gastronomic culture',
    );
  });

  it('findProductoByGCultureId should return product by gastronomic culture', async () => {
    const producto: ProductoEntity =
      await service.findProductoByGCultureId(gculture.id);
    expect(producto).not.toBeNull();
  });
  it('findProductoByGCultureId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() =>
      service.findProductoByGCultureId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associateProductGCulture should update product for a gastronomic culture', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      categoria: faker.commerce.department(),
    });

    const updatedGCulture: CulturagastronomicaEntity =
      await service.associateProductGCulture(gculture.id, newProducto);
    expect(updatedGCulture).not.toBeNull();
    expect(updatedGCulture.producto).not.toBeNull();
    expect(updatedGCulture.producto.nombre).toBe(newProducto.nombre);
    expect(updatedGCulture.producto.descripcion).toBe(newProducto.descripcion);
    expect(updatedGCulture.producto.categoria).toBe(newProducto.categoria);
  });
  it('associateProductGCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      categoria: faker.commerce.department(),
    });

    await expect(() =>
      service.associateProductGCulture('0', newProducto),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associateProductGCulture should throw an exception for an invalid product', async () => {
    const newProducto: ProductoEntity = producto;
    newProducto.id = '0';
    await expect(() =>
      service.associateProductGCulture(gculture.id, newProducto),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductoGCulture should remove an product from a gastronomic culture', async () => {
    const product: ProductoEntity = producto;
    await service.deleteProductoGCulture(gculture.id, product.id);
    const storedGCulture: CulturagastronomicaEntity =
      await gcultureRepository.findOne({
        where: { id: gculture.id },
        relations: ['producto'],
      });
    const deletedProducto: ProductoEntity = storedGCulture.producto;
    expect(deletedProducto).toBeNull();
  });

  it('deleteProductoGCulture should thrown an exception for an invalid product', async () => {
    await expect(() =>
      service.deleteProductoGCulture(gculture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductoGCulture should thrown an exception for an invalid gastronomic culture', async () => {
    const product: ProductoEntity = producto;
    await expect(() =>
      service.deleteProductoGCulture('0', product.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('deleteProductoGCulture should thrown an exception for an non asocciated product', async () => {
    const newGCulture: CulturagastronomicaEntity =
      await gcultureRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      categoria: faker.commerce.department(),
    });

    await expect(() =>
      service.deleteProductoGCulture(newGCulture.id, newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id is not associated to the gastronomic culture',
    );
  });
});
