import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { ValidationMutationPipe } from '../common/validation-mutation.pipe';
import { Message } from '../message/models/message.model';
import { User } from '../user/models/user.model';
import { ForumInput } from './dto/forum.dto';
import { ForumService } from './forum.service';
import { Forum } from './models/forum.model';

@Resolver(() => Forum)
export class ForumResolver {
  constructor(private readonly forumService: ForumService) {}

  @ResolveField('creator', () => User)
  getCreator(@Parent() forum: Forum): User {
    return this.forumService.getCreator(forum);
  }

  @ResolveField('members', () => [User])
  getMembers(@Parent() forum: Forum): User[] {
    return this.forumService.findMembers(forum);
  }

  @ResolveField('messages', () => [Message])
  getMessages(@Parent() forum: Forum): Message[] {
    return this.forumService.findMessages(forum);
  }

  @Query(() => [Forum], { name: 'forums' })
  getAvailableForums(): Forum[] {
    return this.forumService.find().filter(({ isPrivate }) => !isPrivate);
  }

  @Query(() => Forum, { name: 'forum' })
  getOne(
    @Args('userId') userId: string,
    @Args('forumId') forumId: string,
  ): Forum {
    return this.forumService.findOneForUser(userId, forumId);
  }

  @Mutation(() => Forum, { name: 'createForum' })
  createOne(
    @Args('userId') userId: string,
    @Args(
      { name: 'values', type: () => ForumInput },
      new ValidationMutationPipe<ForumInput>(ForumInput),
    )
    input: ForumInput,
  ): Forum {
    return this.forumService.createOne(userId, input);
  }

  /**
   * @todo
   *  - Authorize only if userId is the admin of the forum
   *  - Update the status of request to APPROVED
   *  - Add the forum to the creator of the request (inside its joinedForums property)
   */
  @Mutation(() => Boolean, { name: 'approveForumRequest' })
  approveRequest(
    @Args('userId') userId: string,
    @Args('requestId') requestId: string,
  ): boolean {
    // Prevent eslint warnings
    console.log({ userId, requestId });

    return true;
  }

  /**
   * @todo
   *  - Authorize only if userId is the admin of the forum
   *  - Update the status of request to REJECTED
   */
  @Mutation(() => Boolean, { name: 'rejectForumRequest' })
  rejectRequest(
    @Args('userId') userId: string,
    @Args('requestId') requestId: string,
  ): boolean {
    // Prevent eslint warnings
    console.log({ userId, requestId });

    return true;
  }
}
