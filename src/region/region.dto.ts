import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegionDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly estado: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;
}
