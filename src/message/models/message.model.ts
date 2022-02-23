import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  // forum ID
  forum: string;

  // user ID
  createdBy: string;
}
