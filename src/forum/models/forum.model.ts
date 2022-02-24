import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ForumRequest } from './request.model';

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

  @Field(() => [ForumRequest], { nullable: true })
  requests?: ForumRequest[];
}
