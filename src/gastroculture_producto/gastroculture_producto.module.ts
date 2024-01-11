import { Module } from '@nestjs/common';
import { GastrocultureProductoService } from './gastroculture_producto.service';
import { GastrocultureProductoController } from './gastroculture_producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturagastronomicaEntity } from 'src/culturagastronomica/culturagastronomica.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { GastrocultureProductoResolver } from './gastroculture_producto.resolver';

@Module({
  providers: [GastrocultureProductoService, GastrocultureProductoResolver],
  imports: [
    TypeOrmModule.forFeature([CulturagastronomicaEntity, ProductoEntity]),
  ],
  controllers: [GastrocultureProductoController],
})
export class GastrocultureProductoModule {}
