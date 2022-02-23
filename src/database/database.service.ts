import { Injectable, OnModuleInit } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { Forum } from '../forum/models/forum.model';
import { Message } from '../message/models/message.model';
import { User } from '../user/models/user.model';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private forums: Forum[];
  private messages: Message[];
  private users: User[];

  constructor() {
    this.forums = [];
    this.messages = [];
    this.users = [];
  }

  onModuleInit() {
    this.loadFixtures();
  }

  private loadFixtures() {
    // console.log('load fixtures!');
  }

  /**
   * Generate unique ID of this fake database
   */
  uniqueId(): string {
    return nanoid();
  }

  /* Forum */

  findForums(): Forum[] {
    return this.forums;
  }

  findForumById(id: string): Forum | undefined {
    return this.forums.find((forum) => forum.id === id);
  }

  createForum(forum: Forum) {
    const found = this.findForumById(forum.id);

    if (found) {
      throw new Error(`Duplicate forum.id for ID=${forum.id}`);
    }

    this.forums.push(forum);
  }

  /* Message */

  findMessages(): Message[] {
    return this.messages;
  }

  findMessageById(id: string): Message | undefined {
    return this.messages.find((message) => message.id === id);
  }

  createMessage(message: Message) {
    const found = this.findMessageById(message.id);

    if (found) {
      throw new Error(`Duplicate message.id for ID=${message.id}`);
    }

    this.messages.push(message);
  }

  /* User */

  findUsers(): User[] {
    return this.users;
  }

  findUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  createUser(user: User) {
    const found = this.findUserById(user.id);

    if (found) {
      throw new Error(`Duplicate user.id for ID=${user.id}`);
    }

    this.users.push(user);
  }

  updateUser(id: string, newData: User) {
    const found = this.users.find((user) => user.id === id);

    if (!found) {
      throw new Error(`Can't find the user for ID=${id}`);
    }

    // Update object in place
    Object.assign(found, newData);
  }
}
