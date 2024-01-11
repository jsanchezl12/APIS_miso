/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GastrocultureRecetaService } from './gastroculture_receta.service';
import { GastrocultureRecetaController } from './gastroculture_receta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturagastronomicaEntity } from 'src/culturagastronomica/culturagastronomica.entity';
import { RecetaEntity } from 'src/receta/receta.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { GastrocultureRecetaResolver } from './gastroculture_receta.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  providers: [GastrocultureRecetaService, GastrocultureRecetaResolver],
  imports: [
    TypeOrmModule.forFeature([CulturagastronomicaEntity, RecetaEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 2,
      },
    }),
  ],
  controllers: [GastrocultureRecetaController],
})
export class GastrocultureRecetaModule {}
