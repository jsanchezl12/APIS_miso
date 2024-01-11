import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CulturagastronomicaService } from './culturagastronomica.service';
import { CulturagastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaDto } from './culturagastronomica.dto';
import { plainToInstance } from 'class-transformer';
@Resolver()
export class CulturagastronomicaResolver {
  constructor(private gastrocultureService: CulturagastronomicaService) {}

  @Query(() => [CulturagastronomicaEntity])
  gastrocultures(): Promise<CulturagastronomicaEntity[]> {
    return this.gastrocultureService.findAll();
  }

  @Query(() => CulturagastronomicaEntity)
  gastroculture(@Args('id') id: string): Promise<CulturagastronomicaEntity> {
    return this.gastrocultureService.findOne(id);
  }

  @Mutation(() => CulturagastronomicaEntity)
  createGastroculture(
    @Args('culturagastronomica') gastrocultureDto: CulturagastronomicaDto,
  ): Promise<CulturagastronomicaEntity> {
    const gastroculture = plainToInstance(
      CulturagastronomicaEntity,
      gastrocultureDto,
    );
    return this.gastrocultureService.create(gastroculture);
  }

  @Mutation(() => CulturagastronomicaEntity)
  updateGastroculture(
    @Args('id') id: string,
    @Args('culturagastronomica') gastrocultureDto: CulturagastronomicaDto,
  ): Promise<CulturagastronomicaEntity> {
    const gastroculture = plainToInstance(
      CulturagastronomicaEntity,
      gastrocultureDto,
    );
    return this.gastrocultureService.update(id, gastroculture);
  }

  @Mutation(() => String)
  deleteGastroculture(@Args('id') id: string) {
    this.gastrocultureService.delete(id);
    return id;
  }
}
