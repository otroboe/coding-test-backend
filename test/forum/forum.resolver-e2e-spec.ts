import { INestApplication } from '@nestjs/common';

import { ForumInput } from '../../src/forum/dto/forum.dto';
import { User } from '../../src/user/models/user.model';
import {
  createRawForum,
  createRawUser,
  updateRawUser,
} from '../utils/database';
import {
  expectForbiddenError,
  expectNotFoundError,
  expectValidationError,
} from '../utils/errors';
import { initTestSuite } from '../utils/tools';
import { createForum, getForums, getOneForum } from './forum.test-utils';

describe('Forum Resolver', () => {
  const userId = 'user-id!';
  let app: INestApplication;
  let close: () => Promise<void>;
  let data: Record<string, any>;
  let query: any;
  let response: Record<string, any>;
  let user: User;

  beforeAll(async () => {
    ({ app, close } = await initTestSuite());

    // Create a default user
    user = createRawUser(app, { id: userId });
  });

  afterAll(async () => {
    await close();
  });

  describe('query - forums', () => {
    beforeAll(() => {
      query = getForums(app);
    });

    it('Should return empty list if no forum in DB', async () => {
      ({ data } = await query());
      expect(data.length).toBe(0);
    });

    it('Should return the forums from DB', async () => {
      const batch = 42;

      new Array(batch).fill('').forEach((_, i) => {
        createRawForum(app, userId, { id: `batch-${i}` });
      });

      ({ data } = await query());
      expect(data.length).toBe(batch);
    });
  });

  describe('query - forum', () => {
    const forumId = 'hey-there';

    beforeAll(() => {
      query = getOneForum(app);

      // Create the forum
      createRawForum(app, userId, { id: forumId });

      // Attach the forum to the user
      updateRawUser(app, userId, {
        ...user,
        joinedForums: user.joinedForums.concat(forumId),
      });
    });

    it('Should throw an error if user does not exist', async () => {
      response = await query('some-id', forumId);
      expectNotFoundError(response, 'user');
    });

    it('Should throw an error if forum does not exist', async () => {
      response = await query(userId, 'some-id');
      expectNotFoundError(response, 'forum');
    });

    it('Should throw an error if user did not join the forum', async () => {
      createRawUser(app, { id: 'random-user' });
      response = await query('random-user', forumId);
      expectForbiddenError(response, 'join');
    });

    it('Should be able to get the forum', async () => {
      ({ data } = await query(userId, forumId));

      expect(data.id).toEqual(forumId);
      expect(data.creator.id).toEqual(userId);
      expect(data.messages.length).toEqual(0);

      // The user who created the forum
      expect(data.members.length).toEqual(1);
      expect(data.members[0].id).toEqual(userId);
      expect(data.members[0].name).toEqual(user.name);
    });
  });

  describe('mutation - createForum', () => {
    const validPayload: ForumInput = {
      topic: 'sports',
    };

    beforeAll(() => {
      query = createForum(app);
    });

    it('Should throw an error if user does not exist', async () => {
      response = await query('some-id', validPayload);
      expectNotFoundError(response, 'user');
    });

    it('Should throw an error if topic length is too short', async () => {
      response = await query(userId, {
        ...validPayload,
        topic: 'a',
      });
      expectValidationError(response);
    });

    it('Should create the forum', async () => {
      ({ data } = await query(userId, validPayload));

      expect(data.topic).toEqual(validPayload.topic);
      expect(data.creator.id).toEqual(userId);
      expect(data.messages.length).toEqual(0);

      // The user who created the forum
      expect(data.members.length).toEqual(1);
      expect(data.members[0].id).toEqual(userId);
      expect(data.members[0].name).toEqual(user.name);
    });
  });
});
