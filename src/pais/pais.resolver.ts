import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaisService } from './pais.service';
import { PaisEntity } from './pais.entity';
import { PaisDTO } from './pais.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class PaisResolver{
    constructor(private paisService: PaisService) {}

    @Query(() => [PaisEntity])
    Paises(): Promise<PaisEntity[]> {
    return this.paisService.findAll();
    }

    @Query(() => PaisEntity)
    Pais(@Args('id') id: string): Promise<PaisEntity> {
    return this.paisService.findOne(id);
    }

    @Mutation(() => PaisEntity)
    createPais(@Args('Pais') paisDto: PaisDTO,
    ): Promise<PaisEntity> {
    const pais = plainToInstance(PaisEntity, paisDto);
    return this.paisService.create(pais);
    }

    @Mutation(() => PaisEntity)
    updatePais(@Args('id') id: string,
               @Args('Pais') paisDto: PaisDTO,
    ): Promise<PaisEntity> {
    const pais = plainToInstance(PaisEntity, paisDto);
    return this.paisService.update(id, pais);
    }

    @Mutation(() => String)
    deletePais(@Args('id') id: string) {
    this.paisService.delete(id);
    return id;
    }
}
