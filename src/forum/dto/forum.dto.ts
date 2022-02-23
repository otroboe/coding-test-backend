import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class ForumInput {
  @Field({ description: 'Minimum of 5 characters' })
  @MinLength(5)
  topic: string;
}
