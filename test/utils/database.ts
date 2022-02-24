import { INestApplication } from '@nestjs/common';

import { DatabaseModule } from '../../src/database/database.module';
import { DatabaseService } from '../../src/database/database.service';
import { Forum } from '../../src/forum/models/forum.model';
import { User } from '../../src/user/models/user.model';

export const createRawUser = (
  app: INestApplication,
  data: Partial<User> = {},
): User => {
  const databaseService = app.select(DatabaseModule).get(DatabaseService);
  const user: User = {
    id: databaseService.uniqueId(),
    name: 'Jane',
    picture: 'https://cataas.com/cat?width=100',
    joinedForums: [],
    ...data,
  };

  databaseService.createUser(user);

  return user;
};

export const updateRawUser = (
  app: INestApplication,
  userId: string,
  data: User,
): void => {
  const databaseService = app.select(DatabaseModule).get(DatabaseService);

  databaseService.updateUser(userId, data);
};

export const createRawForum = (
  app: INestApplication,
  userId: string,
  data: Partial<Forum> = {},
): Forum => {
  const databaseService = app.select(DatabaseModule).get(DatabaseService);
  const forum: Forum = {
    createdBy: userId,
    id: databaseService.uniqueId(),
    topic: 'sports',
    isPrivate: false,
    ...data,
  };

  databaseService.createForum(forum);

  return forum;
};
