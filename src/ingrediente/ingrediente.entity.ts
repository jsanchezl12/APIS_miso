import { RecetaEntity } from '../receta/receta.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class IngredienteEntity {
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
  count: number;

  @Field((type) => [RecetaEntity])
  @ManyToMany(() => RecetaEntity, (receta) => receta.ingredientes)
  @JoinTable()
  ingredientes: RecetaEntity[];
}
