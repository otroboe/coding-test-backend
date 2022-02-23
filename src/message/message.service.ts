import { Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { ForumService } from '../forum/forum.service';
import { User } from '../user/models/user.model';
import { MessageInput } from './dto/message.dto';
import { Message } from './models/message.model';

@Injectable()
export class MessageService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly forumService: ForumService,
  ) {}

  getCreator({ createdBy }: Message): User {
    const user = this.databaseService.findUserById(createdBy);

    // Safety check, should not happen
    if (!user) {
      throw new NotFoundException(`Can't find the user for ID=${createdBy}`);
    }

    return user;
  }

  createOne(userId: string, forumId: string, input: MessageInput) {
    // Check IDs and user access
    this.forumService.findOneForUser(userId, forumId);

    const message: Message = {
      ...input,
      createdAt: new Date(),
      createdBy: userId,
      forum: forumId,
      id: this.databaseService.uniqueId(),
    };

    this.databaseService.createMessage(message);

    return message;
  }
}
