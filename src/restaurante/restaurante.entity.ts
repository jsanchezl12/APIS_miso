import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RestauranteEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  numberStars: number;

  @Field()
  @Column()
  date: Date;

  @Field((type) => [CulturagastronomicaEntity])
  @OneToMany(
    () => CulturagastronomicaEntity,
    (culturagastronomica) => culturagastronomica.restaurante,
  )
  culturasgastronomicas: CulturagastronomicaEntity[];
}
