import { Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { Forum } from '../forum/models/forum.model';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  getJoinedForums(user: User): Forum[] {
    const forums = this.databaseService.findForums();

    return forums.filter(({ id }) => user.joinedForums.includes(id));
  }

  findById(id: string): User {
    const found = this.databaseService
      .findUsers()
      .find((user) => user.id === id);

    if (!found) {
      throw new NotFoundException(`Can't find the user for ID=${id}`);
    }

    return found;
  }

  joinForum(userId: string, forumId: string): User {
    // Check if user exists
    const user = this.findById(userId);

    // Check if forum exists
    const forum = this.databaseService.findForumById(forumId);

    if (!forum) {
      throw new NotFoundException(`Can't find the forum for ID=${forumId}`);
    }

    // Find data of user
    const { joinedForums, ...userProps } = user;

    // Update user with new list of joined forums
    this.databaseService.updateUser(userId, {
      ...userProps,
      joinedForums: joinedForums.concat(forumId),
    });

    // Return the updated user
    return this.findById(userId);
  }
}
