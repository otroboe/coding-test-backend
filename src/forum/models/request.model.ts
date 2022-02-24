import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import { User } from '../../user/models/user.model';

export enum ForumRequestType {
  JOIN = 'JOIN',
}

registerEnumType(ForumRequestType, {
  name: 'ForumRequestType',
});

export enum ForumRequestStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

registerEnumType(ForumRequestStatus, {
  name: 'ForumRequestStatus',
});

@ObjectType()
export class ForumRequest {
  @Field(() => ID)
  id: string;

  @Field(() => ForumRequestType)
  type: ForumRequestType;

  @Field(() => ForumRequestStatus)
  status: ForumRequestStatus;

  @Field(() => User)
  createdBy: User;
}
