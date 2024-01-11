import { Module } from '@nestjs/common';
import { GastrocultureRestauranteService } from './gastroculture_restaurante.service';
import { GastrocultureRestauranteController } from './gastroculture_restaurante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturagastronomicaEntity } from 'src/culturagastronomica/culturagastronomica.entity';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { GastrocultureRestauranteResolver } from './gastroculture_restaurante.resolver';

@Module({
  providers: [GastrocultureRestauranteService, GastrocultureRestauranteResolver],
  imports: [
    TypeOrmModule.forFeature([CulturagastronomicaEntity, RestauranteEntity]),
  ],
  controllers: [GastrocultureRestauranteController],
})
export class GastrocultureRestauranteModule {}
