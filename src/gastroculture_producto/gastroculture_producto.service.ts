/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class GastrocultureProductoService {
  constructor(
    @InjectRepository(CulturagastronomicaEntity)
    private readonly gcultureRepository: Repository<CulturagastronomicaEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async addProductGCulture(
    gcultureId: string,
    productoId: string,
  ): Promise<CulturagastronomicaEntity> {
    const producto: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id: productoId },
      });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['producto'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    gculture.producto = producto;
    return await this.gcultureRepository.save(gculture);
  }

  async findProductoByGCultureIdProductoId(
    gcultureId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id: productoId },
      });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['producto'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    if (!gculture.producto) {
      throw new BusinessLogicException(
        'The gastronomic culture is not associated to a product',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const gcultureProducto: ProductoEntity =
      gculture.producto.id == producto.id ? gculture.producto : null;
    if (!gcultureProducto) {
      throw new BusinessLogicException(
        'The product with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return gcultureProducto;
  }

  async findProductoByGCultureId(
    gcultureId: string,
  ): Promise<ProductoEntity> {
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['producto'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return gculture.producto;
  }

  async associateProductGCulture(
    gcultureId: string,
    product: ProductoEntity,
  ): Promise<CulturagastronomicaEntity> {
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['producto'],
      });

    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const producto: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id: product.id },
      });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    gculture.producto = producto;
    return await this.gcultureRepository.save(gculture);
  }

  async deleteProductoGCulture(gcultureId: string, productoId: string) {
    const producto: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id: productoId },
      });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    const gculture: CulturagastronomicaEntity =
      await this.gcultureRepository.findOne({
        where: { id: gcultureId },
        relations: ['producto'],
      });
    if (!gculture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    if (!gculture.producto) {
      throw new BusinessLogicException(
        'The product with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    gculture.producto = null;
    await this.gcultureRepository.save(gculture);
  }
}
