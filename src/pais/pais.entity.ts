import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RegionEntity } from '../region/region.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PaisEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field((type) => [CulturagastronomicaEntity])
  @OneToMany(
    () => CulturagastronomicaEntity,
    (culturagastronomica) => culturagastronomica.restaurante,
  )
  culturasgastronomicas: CulturagastronomicaEntity[];

  @Field((type) => [RegionEntity])
  @OneToMany(() => RegionEntity, (region) => region.pais)
  regiones: RegionEntity[];
}
