import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturagastronomicaEntity } from '../../culturagastronomica/culturagastronomica.entity';
import { IngredienteEntity } from '../../ingrediente/ingrediente.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';
import { PaisEntity } from '../../pais/pais.entity';
import { RegionEntity } from '../../region/region.entity';
import { ProductoEntity } from '../../producto/producto.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { RecetaIngredienteEntity } from '../../receta/recetaIngrediente/recetaIngrediente.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CulturagastronomicaEntity,
      IngredienteEntity,
      RestauranteEntity,
      PaisEntity,
      RegionEntity,
      ProductoEntity,
      RecetaEntity,
      RecetaIngredienteEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CulturagastronomicaEntity,
    IngredienteEntity,
    RestauranteEntity,
    PaisEntity,
    RegionEntity,
    ProductoEntity,
    RecetaEntity,
    RecetaIngredienteEntity,
  ]),
];
