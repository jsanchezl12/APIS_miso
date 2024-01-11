import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GastrocultureRecetaService } from './gastroculture_receta.service';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { RecetaDTO } from '../receta/recetaDTO';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class GastrocultureRecetaResolver {
  constructor(private gcultureRecetaService: GastrocultureRecetaService) {}
  @Query(() => RecetaEntity)
  async findRecetaByGCultureIdRecetaId(
    @Args('gcultureId') gcultureId: string,
    @Args('recetaId') recetaId: string,
  ): Promise<RecetaEntity> {
    return await this.gcultureRecetaService.findRecetaByGCultureIdRecetaId(
      gcultureId,
      recetaId,
    );
  }

  @Query(() => [RecetaEntity])
  async findRecetasByGCultureId(
    @Args('gcultureId') gcultureId: string,
  ): Promise<RecetaEntity[]> {
    return await this.gcultureRecetaService.findRecetaByGCultureId(gcultureId);
  }

  @Mutation(() => CulturagastronomicaEntity)
  async addRecipeGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('recetaId') recetaId: string,
  ): Promise<CulturagastronomicaEntity> {
    return await this.gcultureRecetaService.addRecipeGCulture(
      gcultureId,
      recetaId,
    );
  }

  @Mutation(() => CulturagastronomicaEntity)
  async associateRecetaGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('recetas', { type: () => [RecetaDTO] }) recetaDto: RecetaDTO[], // Especifica el tipo de los argumentos
  ): Promise<CulturagastronomicaEntity> {
    try {
      const receta: RecetaEntity[] = plainToInstance(RecetaEntity, recetaDto);
      const updatedCulturagastronomica =
        await this.gcultureRecetaService.associateRecipeGCulture(
          gcultureId,
          receta,
        );
      return updatedCulturagastronomica;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  @Mutation(() => String)
  async deleteRecetaGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('recetaId') recetaId: string,
  ) {
    await this.gcultureRecetaService.deleteRecetaGCulture(gcultureId, recetaId);
    return recetaId;
  }
}
