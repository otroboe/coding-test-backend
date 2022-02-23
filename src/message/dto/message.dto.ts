import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class MessageInput {
  @Field({ description: 'Minimum of 2 characters' })
  @MinLength(2)
  content: string;
}
