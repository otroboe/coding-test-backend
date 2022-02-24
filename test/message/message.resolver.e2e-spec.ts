import { INestApplication } from '@nestjs/common';

import { MessageInput } from '../../src/message/dto/message.dto';
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
import { postMessage } from './message.test-utils';

describe('Message Resolver', () => {
  const forumId = 'forum-id!';
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

    // Create a forum
    createRawForum(app, userId, { id: forumId });

    // Attach the forum to the user
    updateRawUser(app, userId, {
      ...user,
      joinedForums: user.joinedForums.concat(forumId),
    });
  });

  afterAll(async () => {
    await close();
  });

  describe('mutation - postMessage', () => {
    const validPayload: MessageInput = {
      content: 'hello world!',
    };

    beforeAll(() => {
      query = postMessage(app);
    });

    it('Should throw an error if user does not exist', async () => {
      response = await query('some-id', forumId, validPayload);
      expectNotFoundError(response, 'user');
    });

    it('Should throw an error if forum does not exist', async () => {
      response = await query(userId, 'some-id', validPayload);
      expectNotFoundError(response, 'forum');
    });

    it('Should throw an error if user did not join the forum', async () => {
      createRawUser(app, { id: 'random-user' });
      response = await query('random-user', forumId, validPayload);
      expectForbiddenError(response, 'join');
    });

    it('Should throw an error if content length is too short', async () => {
      response = await query(userId, forumId, {
        ...validPayload,
        content: 'b',
      });
      expectValidationError(response);
    });

    it('Should be able to post a message', async () => {
      ({ data } = await query(userId, forumId, validPayload));
      expect(data.content).toEqual(validPayload.content);
      expect(data.createdAt).toBeDefined();
      expect(data.creator.id).toEqual(userId);
    });
  });
});
