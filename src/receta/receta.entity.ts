import { IngredienteEntity } from '../ingrediente/ingrediente.entity';
import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RecetaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  proceso: string;

  @Field()
  @Column()
  descripcion: string;

  @Field()
  @Column()
  urlFotoPlato: string;

  @Field()
  @Column()
  urlVideoPreparacion: string;

  @Field((type) => CulturagastronomicaEntity)
  @ManyToOne(
    () => CulturagastronomicaEntity,
    (culturagastronomica) => culturagastronomica.recetas,
  )
  culturaGastronomica: CulturagastronomicaEntity;

  @Field((type) => [IngredienteEntity])
  @ManyToMany(
    () => IngredienteEntity,
    (ingrediente) => ingrediente.ingredientes,
  )
  @JoinTable()
  ingredientes: IngredienteEntity[];
}
