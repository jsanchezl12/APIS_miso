import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionService } from './region.service';
import { RegionEntity } from './region.entity';
import { RegionController } from './region.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RegionResolver } from './region.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegionEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 2,
      },
    }),
  ],
  providers: [RegionService, RegionResolver],
  controllers: [RegionController],
})
export class RegionModule {}
