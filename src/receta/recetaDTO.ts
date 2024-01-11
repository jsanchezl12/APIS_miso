import { IsString, IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class RecetaDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly proceso: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @Field()
  @IsString()
  readonly urlFotoPlato: string;

  @Field()
  @IsString()
  readonly urlVideoPreparacion: string;
}
