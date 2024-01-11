import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturagastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaService } from './culturagastronomica.service';
import { CulturagastronomicaController } from './culturagastronomica.controller';
import { CulturagastronomicaResolver } from './culturagastronomica.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([CulturagastronomicaEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 2,
      },
    }),
  ],
  providers: [CulturagastronomicaService, CulturagastronomicaResolver],
  controllers: [CulturagastronomicaController],
})
export class CulturagastronomicaModule {}
