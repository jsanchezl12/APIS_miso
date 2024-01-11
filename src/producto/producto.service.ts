import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductoService {
  cacheKey = 'producto';
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    const cached: ProductoEntity[] = await this.cacheManager.get<
      ProductoEntity[]
    >(this.cacheKey);
    if (!cached) {
      const productos: ProductoEntity[] = await this.productoRepository.find({
        relations: ['culturasgastronomicas'],
      });
      await this.cacheManager.set(this.cacheKey, productos);
      return productos;
    }
    return cached;
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['culturasgastronomicas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    return await this.productoRepository.save(producto);
  }

  async update(
    id: string,
    productoData: ProductoEntity,
  ): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id },
      });
    if (!persistedProducto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.productoRepository.save({
      ...persistedProducto,
      ...productoData,
    });
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
