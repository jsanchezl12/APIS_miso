import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.commerce.productName(),
        descripcion: faker.lorem.sentence(),
        categoria: faker.commerce.department(),
      });
      productosList.push(producto);
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
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.descripcion).toEqual(storedProducto.descripcion);
    expect(producto.categoria).toEqual(storedProducto.categoria);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('create should return a new product', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      categoria: faker.commerce.department(),
      culturasgastronomicas: [],
    };
    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();
    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: newProducto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre);
    expect(storedProducto.descripcion).toEqual(producto.descripcion);
    expect(storedProducto.categoria).toEqual(producto.categoria);
  });

  it('update should modify a product', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'New name';
    producto.descripcion = 'New desc';
    const updateProducto: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(updateProducto).not.toBeNull();
    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre);
    expect(storedProducto.descripcion).toEqual(producto.descripcion);
  });

  it('update should throw an exception for an invalid product', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto,
      nombre: 'New name',
      descripcion: 'New desc',
      categoria: 'New category',
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('delete should remove a product', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    const deletedProducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });
});
