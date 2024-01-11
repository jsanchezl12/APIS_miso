import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class RestauranteDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  readonly numberStars: number;

  @Field()
  @IsNotEmpty()
  readonly date: Date;
}
