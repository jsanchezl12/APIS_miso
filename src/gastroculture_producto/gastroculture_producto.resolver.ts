import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GastrocultureProductoService } from './gastroculture_producto.service';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { ProductoDTO } from '../producto/productoDTO';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class GastrocultureProductoResolver {
  constructor(private gcultureProductoService: GastrocultureProductoService) {}
  @Query(() => ProductoEntity)
  async findProductoByGCultureIdProductoId(
    @Args('gcultureId') gcultureId: string,
    @Args('productoId') productoId: string,
  ): Promise<ProductoEntity> {
    return await this.gcultureProductoService.findProductoByGCultureIdProductoId(
      gcultureId,
      productoId,
    );
  }

  @Query(() => ProductoEntity)
  async findProductoByGCultureId(
    @Args('gcultureId') gcultureId: string,
  ): Promise<ProductoEntity> {
    return await this.gcultureProductoService.findProductoByGCultureId(
      gcultureId,
    );
  }

  @Mutation(() => CulturagastronomicaEntity)
  async addProductGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('productoId') productoId: string,
  ): Promise<CulturagastronomicaEntity> {
    return await this.gcultureProductoService.addProductGCulture(
      gcultureId,
      productoId,
    );
  }

  @Mutation(() => CulturagastronomicaEntity)
  async associateProductoGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('producto') productoDto: ProductoDTO,
  ): Promise<CulturagastronomicaEntity> {
    try {
      const producto = plainToInstance(ProductoEntity, productoDto);
      const updatedCulturagastronomica =
        await this.gcultureProductoService.associateProductGCulture(
          gcultureId,
          producto,
        );
      return updatedCulturagastronomica;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  @Mutation(() => String)
  async deleteProductoGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('productoId') productoId: string,
  ) {
    await this.gcultureProductoService.deleteProductoGCulture(
      gcultureId,
      productoId,
    );
    return productoId;
  }
}
