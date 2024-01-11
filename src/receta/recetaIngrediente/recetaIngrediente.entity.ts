import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecetaEntity } from '../receta.entity';
import { IngredienteEntity } from '../../ingrediente/ingrediente.entity';

@Entity()
export class RecetaIngredienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RecetaEntity, (receta) => receta.ingredientes)
  receta: RecetaEntity;

  @ManyToOne(() => IngredienteEntity, (ingrediente) => ingrediente.ingredientes)
  ingrediente: IngredienteEntity;
}
