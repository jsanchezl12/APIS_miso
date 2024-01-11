import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturagastronomicaModule } from './culturagastronomica/culturagastronomica.module';
import { CulturagastronomicaEntity } from './culturagastronomica/culturagastronomica.entity';
import { IngredienteModule } from './ingrediente/ingrediente.module';
import { RestauranteModule } from './restaurante/restaurante.module';
import { IngredienteEntity } from './ingrediente/ingrediente.entity';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { RegionModule } from './region/region.module';
import { RegionEntity } from './region/region.entity';
import { PaisModule } from './pais/pais.module';
import { PaisEntity } from './pais/pais.entity';
import { RecetaModule } from './receta/receta.module';
import { RecetaEntity } from './receta/receta.entity';
import { ProductoModule } from './producto/producto.module';
import { ProductoEntity } from './producto/producto.entity';
import { RecetaIngredienteEntity } from './receta/recetaIngrediente/recetaIngrediente.entity';
import { GastrocultureRestauranteModule } from './gastroculture_restaurante/gastroculture_restaurante.module';
import { GastroculturePaisModule } from './gastroculture_pais/gastroculture_pais.module';
import { GastrocultureProductoModule } from './gastroculture_producto/gastroculture_producto.module';
import { GastrocultureRecetaModule } from './gastroculture_receta/gastroculture_receta.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'gastroapidb',
      entities: [
        CulturagastronomicaEntity,
        IngredienteEntity,
        RestauranteEntity,
        RegionEntity,
        PaisEntity,
        RecetaEntity,
        ProductoEntity,
        RecetaIngredienteEntity,
      ],
      dropSchema: false,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CulturagastronomicaModule,
    IngredienteModule,
    RestauranteModule,
    RegionModule,
    PaisModule,
    RecetaModule,
    ProductoModule,
    GastrocultureRestauranteModule,
    GastroculturePaisModule,
    GastrocultureProductoModule,
    GastrocultureRecetaModule,
    UserModule,
    AuthModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
