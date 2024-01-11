import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IngredienteService } from './ingrediente.service';
import { IngredienteEntity } from '../ingrediente/ingrediente.entity';
import { IngredienteDto } from './ingrediente.dto/ingrediente.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class IngredienteResolver {
  constructor(private ingredienteService: IngredienteService) {}

  @Query(() => [IngredienteEntity])
  ingredientes(): Promise<IngredienteEntity[]> {
    return this.ingredienteService.findAll();
  }

  @Query(() => IngredienteEntity)
  ingrediente(@Args('id') id: string): Promise<IngredienteEntity> {
    return this.ingredienteService.findOne(id);
  }

  @Mutation(() => IngredienteEntity)
  createIngrediente(
    @Args('ingrediente') ingredienteDto: IngredienteDto,
  ): Promise<IngredienteEntity> {
    const ingrediente = plainToInstance(IngredienteEntity, ingredienteDto);
    return this.ingredienteService.create(ingrediente);
  }

  @Mutation(() => IngredienteEntity)
  updateIngrediente(
    @Args('id') id: string,
    @Args('ingrediente') ingredienteDto: IngredienteDto,
  ): Promise<IngredienteEntity> {
    const ingrediente = plainToInstance(IngredienteEntity, ingredienteDto);
    return this.ingredienteService.update(id, ingrediente);
  }

  @Mutation(() => String)
  deleteIngrediente(@Args('id') id: string) {
    this.ingredienteService.delete(id);
    return id;
  }
}
