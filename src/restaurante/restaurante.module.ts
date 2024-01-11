/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteController } from './restaurante.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RestauranteResolver } from './restaurante.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity]),     
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 2,
      },
    }),
  ],
  providers: [RestauranteService, RestauranteResolver],
  controllers: [RestauranteController],
})
export class RestauranteModule {}
