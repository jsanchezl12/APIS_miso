import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GastrocultureRestauranteService } from './gastroculture_restaurante.service';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteDTO } from '../restaurante/restaurante.dto/restaurante.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class GastrocultureRestauranteResolver {
  constructor(
    private gcultureRestauranteService: GastrocultureRestauranteService,
  ) {}
  @Query(() => RestauranteEntity)
  async findRestauranteByGCultureIdRestauranteId(
    @Args('gcultureId') gcultureId: string,
    @Args('restauranteId') restauranteId: string,
  ): Promise<RestauranteEntity> {
    return await this.gcultureRestauranteService.findRestauranteByGCultureIdRestauranteId(
      gcultureId,
      restauranteId,
    );
  }

  @Query(() => RestauranteEntity)
  async findRestauranteByGCultureId(
    @Args('gcultureId') gcultureId: string,
  ): Promise<RestauranteEntity> {
    return await this.gcultureRestauranteService.findRestauranteByGCultureId(
      gcultureId,
    );
  }

  @Mutation(() => CulturagastronomicaEntity)
  async addRestaurantGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('restauranteId') restauranteId: string,
  ): Promise<CulturagastronomicaEntity> {
    return await this.gcultureRestauranteService.addRestaurantGCulture(
      gcultureId,
      restauranteId,
    );
  }

  @Mutation(() => CulturagastronomicaEntity)
  async associateRestauranteGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('restaurante') restauranteDto: RestauranteDTO,
  ): Promise<CulturagastronomicaEntity> {
    try {
      const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
      const updatedCulturagastronomica =
        await this.gcultureRestauranteService.associateRestaurantGCulture(
          gcultureId,
          restaurante,
        );
      return updatedCulturagastronomica;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  @Mutation(() => String)
  async deleteRestauranteGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('restauranteId') restauranteId: string,
  ) {
    await this.gcultureRestauranteService.deleteRestauranteGCulture(
      gcultureId,
      restauranteId,
    );
    return restauranteId;
  }
}
