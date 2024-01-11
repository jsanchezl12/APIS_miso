import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class ProductoDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly categoria: string;
}
