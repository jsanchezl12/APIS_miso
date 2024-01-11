// producto.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { plainToInstance } from 'class-transformer';
import { ProductoDTO } from './productoDTO';

@Resolver()
export class ProductoResolver {
  constructor(private productoService: ProductoService) {}

  @Query(() => [ProductoEntity])
  Productos(): Promise<ProductoEntity[]> {
    return this.productoService.findAll();
  }

  @Query(() => ProductoEntity)
  Producto(@Args('id') id: string): Promise<ProductoEntity> {
    return this.productoService.findOne(id);
  }

  @Mutation(() => ProductoEntity)
  createProducto(
    @Args('Producto') productoDto: ProductoDTO,
  ): Promise<ProductoEntity> {
    const producto = plainToInstance(ProductoEntity, productoDto);
    return this.productoService.create(producto);
  }

  @Mutation(() => ProductoEntity)
  updateProducto(
    @Args('id') id: string,
    @Args('Producto') productoDto: ProductoDTO,
  ): Promise<ProductoEntity> {
    const producto = plainToInstance(ProductoEntity, productoDto);
    return this.productoService.update(id, producto);
  }

  @Mutation(() => String)
  deleteProducto(@Args('id') id: string) {
    this.productoService.delete(id);
    return id;
  }
}
