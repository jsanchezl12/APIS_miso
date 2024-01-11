import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoController } from './productoController';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';
import { ProductoResolver } from './producto.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 2,
      },
    }),
  ],
  providers: [ProductoService, ProductoResolver],
  controllers: [ProductoController],
})
export class ProductoModule {}
