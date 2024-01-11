import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RegionEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  estado: string;

  @Field()
  @Column()
  descripcion: string;

  @Field((type) => PaisEntity)
  @ManyToOne(() => PaisEntity, (pais) => pais.regiones)
  pais: PaisEntity;
}
