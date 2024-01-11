import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GastroculturePaisService } from './gastroculture_pais.service';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { PaisDTO } from '../pais/pais.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class GastroculturePaisResolver {
  constructor(private gculturePaisService: GastroculturePaisService) {}

  @Query(() => PaisEntity)
  async findPaisByGCultureIdPaisId(
    @Args('gcultureId') gcultureId: string,
    @Args('paisId') paisId: string,
  ): Promise<PaisEntity> {
    return await this.gculturePaisService.findPaisByGCultureIdPaisId(
      gcultureId,
      paisId,
    );
  }

  @Query(() => PaisEntity)
  async findPaisByGCultureId(
    @Args('gcultureId') gcultureId: string,
  ): Promise<PaisEntity> {
    return await this.gculturePaisService.findPaisByGCultureId(gcultureId);
  }

  @Mutation(() => CulturagastronomicaEntity)
  async addCountryGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('paisId') paisId: string,
  ): Promise<CulturagastronomicaEntity> {
    return await this.gculturePaisService.addCountryGCulture(
      gcultureId,
      paisId,
    );
  }

  @Mutation(() => CulturagastronomicaEntity)
  async associatePaisGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('pais') paisDto: PaisDTO,
  ): Promise<CulturagastronomicaEntity> {
    try {
      const pais = plainToInstance(PaisEntity, paisDto);
      const updatedCulturagastronomica =
        await this.gculturePaisService.associatePaisGCulture(gcultureId, pais);
      return updatedCulturagastronomica;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  @Mutation(() => String)
  async deletePaisGCulture(
    @Args('gcultureId') gcultureId: string,
    @Args('paisId') paisId: string,
  ) {
    await this.gculturePaisService.deletePaisGCulture(gcultureId, paisId);
    return paisId;
  }
}
