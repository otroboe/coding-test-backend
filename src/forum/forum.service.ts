import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { Message } from '../message/models/message.model';
import { User } from '../user/models/user.model';
import { ForumInput } from './dto/forum.dto';
import { Forum } from './models/forum.model';

@Injectable()
export class ForumService {
  constructor(private readonly databaseService: DatabaseService) {}

  find(): Forum[] {
    return this.databaseService.findForums();
  }

  checkUserAccess(userId: string, forumId: string) {
    const user = this.databaseService.findUserById(userId);

    if (!user) {
      throw new NotFoundException(`Can't find the user for ID=${userId}`);
    }

    // Cant fetch forum if user not joined yet
    if (!user.joinedForums.includes(forumId)) {
      throw new ForbiddenException('You need to join the forum first');
    }
  }

  findOneForUser(userId: string, forumId: string): Forum {
    const forum = this.findById(forumId);

    this.checkUserAccess(userId, forumId);

    return forum;
  }

  findById(id: string): Forum {
    const found = this.databaseService
      .findForums()
      .find((forum) => forum.id === id);

    if (!found) {
      throw new NotFoundException(`Can't find the forum for ID=${id}`);
    }

    return found;
  }

  createOne(userId: string, input: ForumInput): Forum {
    const user = this.databaseService.findUserById(userId);

    if (!user) {
      throw new NotFoundException(`Can't find the user for ID=${userId}`);
    }

    const forum: Forum = {
      ...input,
      createdBy: userId,
      id: this.databaseService.uniqueId(),
    };

    this.databaseService.createForum(forum);

    const { joinedForums, ...userProps } = user;

    // Add the forum to the user
    this.databaseService.updateUser(userId, {
      ...userProps,
      joinedForums: joinedForums.concat(forum.id),
    });

    return forum;
  }

  getCreator({ createdBy }: Forum): User {
    const user = this.databaseService.findUserById(createdBy);

    // Safety check, should not happen
    if (!user) {
      throw new NotFoundException(`Can't find the user for ID=${createdBy}`);
    }

    return user;
  }

  /**
   * Find users who joined the forum
   */
  findMembers({ id }: Forum): User[] {
    return this.databaseService
      .findUsers()
      .filter(({ joinedForums }) => joinedForums.includes(id));
  }

  /**
   * Put recent messages first
   */
  findMessages({ id }: Forum): Message[] {
    return this.databaseService
      .findMessages()
      .filter(({ forum }) => forum === id)
      .sort((m1, m2) => m2.createdAt.getTime() - m1.createdAt.getTime());
  }
}
