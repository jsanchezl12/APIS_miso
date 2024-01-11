import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegionService } from './region.service';
import { RegionEntity } from './region.entity';
import { RegionDTO } from './region.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class RegionResolver {
    constructor(private regionService: RegionService) {}

    @Query(() => [RegionEntity])
    regions(): Promise<RegionEntity[]> {
    return this.regionService.findAll();
    }

    @Query(() => RegionEntity)
    region(@Args('id') id: string): Promise<RegionEntity> {
    return this.regionService.findOne(id);
    }

    @Mutation(() => RegionEntity)
    createRegion(@Args('Region') regionDto: RegionDTO,
    ): Promise<RegionEntity> {
    const region = plainToInstance(RegionEntity, regionDto);
    return this.regionService.create(region);
    }

    @Mutation(() => RegionEntity)
    updateRegion(@Args('id') id: string,
                 @Args('Region') regionDto: RegionDTO,
    ): Promise<RegionEntity> {
    const region = plainToInstance(RegionEntity, regionDto);
    return this.regionService.update(id, region);
    }

    @Mutation(() => String)
    deleteRegion(@Args('id') id: string) {
    this.regionService.delete(id);
    return id;
    }
}
