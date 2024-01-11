// receta.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { plainToInstance } from 'class-transformer';
import { RecetaDTO } from './recetaDTO';

@Resolver()
export class RecetaResolver {
  constructor(private recetaService: RecetaService) {}

  @Query(() => [RecetaEntity])
  Recetas(): Promise<RecetaEntity[]> {
    return this.recetaService.findAll();
  }

  @Query(() => RecetaEntity)
  Receta(@Args('id') id: string): Promise<RecetaEntity> {
    return this.recetaService.findOne(id);
  }

  @Mutation(() => RecetaEntity)
  createReceta(@Args('Receta') recetaDto: RecetaDTO): Promise<RecetaEntity> {
    const receta = plainToInstance(RecetaEntity, recetaDto);
    return this.recetaService.create(receta);
  }

  @Mutation(() => RecetaEntity)
  updateReceta(
    @Args('id') id: string,
    @Args('Receta') recetaDto: RecetaDTO,
  ): Promise<RecetaEntity> {
    const receta = plainToInstance(RecetaEntity, recetaDto);
    return this.recetaService.update(id, receta);
  }

  @Mutation(() => String)
  deleteReceta(@Args('id') id: string) {
    this.recetaService.delete(id);
    return id;
  }
}
