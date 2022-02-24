import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Forum {
  @Field(() => ID)
  id: string;

  @Field()
  topic: string;

  @Field()
  isPrivate: boolean;

  // user id
  createdBy: string;
}
