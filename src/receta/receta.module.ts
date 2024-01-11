import { Module } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaController } from './receta.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';
import { RecetaResolver } from './receta.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecetaEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 2,
      },
    }),
  ],
  providers: [RecetaService, RecetaResolver],
  controllers: [RecetaController],
})
export class RecetaModule {}
