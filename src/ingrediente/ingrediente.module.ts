/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { IngredienteService } from './ingrediente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredienteEntity } from './ingrediente.entity';
import { IngredienteController } from './ingrediente.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { IngredienteResolver } from './ingrediente.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([IngredienteEntity]),     
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 2,
      },
    }),
  ],
  providers: [IngredienteService, IngredienteResolver],
  controllers: [IngredienteController],
})
export class IngredienteModule {}
