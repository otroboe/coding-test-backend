import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import data from '../../assets/fixtures.json';
import { Forum } from '../forum/models/forum.model';
import { Message } from '../message/models/message.model';
import { User } from '../user/models/user.model';
import { DatabaseService } from './database.service';

@Injectable()
export class FixturesService {
  private logger = new Logger(FixturesService.name);

  constructor(
    @Inject(forwardRef(() => DatabaseService))
    private readonly databaseService: DatabaseService,
  ) {}

  async load() {
    const { users, forums, messages } = data;

    this.loadUsers(users);
    this.loadForums(forums);
    await this.loadMessages(messages);

    this.logger.log('Fixtures loaded!');
  }

  private loadUsers(users: Record<string, any>[]) {
    users.forEach((user) => {
      this.databaseService.createUser(user as User);
    });
  }

  private loadForums(forums: Record<string, any>[]) {
    forums.forEach((forum) => {
      this.databaseService.createForum(forum as Forum);
    });
  }

  private async loadMessages(messages: Record<string, any>[]) {
    for (const message of messages) {
      this.databaseService.createMessage({
        ...message,
        id: this.databaseService.uniqueId(),
        createdAt: new Date(),
      } as Message);

      // Simulate a delay to have different times for messages and test ordering
      await sleep(500);
    }
  }
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
