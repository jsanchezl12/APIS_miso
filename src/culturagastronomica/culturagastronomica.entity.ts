import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PaisEntity } from '../pais/pais.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturagastronomicaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column('text')
  descripcion: string;

  @Field((type) => RestauranteEntity)
  @ManyToOne(
    () => RestauranteEntity,
    (restaurante) => restaurante.culturasgastronomicas,
  )
  restaurante: RestauranteEntity;

  @Field((type) => PaisEntity)
  @ManyToOne(() => PaisEntity, (pais) => pais.culturasgastronomicas)
  pais: PaisEntity;

  @Field((type) => ProductoEntity)
  @ManyToOne(() => ProductoEntity, (producto) => producto.culturasgastronomicas)
  producto: ProductoEntity;

  @Field((type) => [RecetaEntity])
  @OneToMany(() => RecetaEntity, (receta) => receta.culturaGastronomica)
  recetas: RecetaEntity[];
}
