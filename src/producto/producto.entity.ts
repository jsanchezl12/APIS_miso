import { CulturagastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductoEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field()
  @Column()
  categoria: string;

  @Field((type) => [CulturagastronomicaEntity])
  @OneToMany(
    () => CulturagastronomicaEntity,
    (culturagastronomica) => culturagastronomica.producto,
  )
  culturasgastronomicas: CulturagastronomicaEntity[];
}
