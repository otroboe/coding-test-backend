import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Forum } from '../forum/models/forum.model';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField('forums', () => [Forum])
  getJoinedForums(@Parent() user: User): Forum[] {
    return this.userService.getJoinedForums(user);
  }

  @Query(() => User, { name: 'user' })
  getOne(@Args('id') id: string): User {
    return this.userService.findById(id);
  }

  @Mutation(() => User, { name: 'joinForum' })
  joinForum(
    @Args('userId') userId: string,
    @Args('forumId') forumId: string,
  ): User {
    return this.userService.joinForum(userId, forumId);
  }
}
