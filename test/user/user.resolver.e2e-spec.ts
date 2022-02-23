import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { createRawForum, createRawUser } from '../utils/database';
import { expectNotFoundError } from '../utils/errors';
import { getOneUser, joinForum } from './user.test-utils';

describe('User Resolver', () => {
  let app: INestApplication;
  let data: Record<string, any>;
  let query: any;
  let response: Record<string, any>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  describe('query - user', () => {
    const userId = 'yep';

    beforeAll(() => {
      createRawUser(app, { id: userId, name: 'Bob' });
      query = getOneUser(app);
    });

    it('Should throw an error if user does not exist', async () => {
      response = await query('some-id');
      expectNotFoundError(response, 'user');
    });

    it('Should return the user data with a correct ID', async () => {
      ({ data } = await query(userId));

      expect(data.id).toEqual(userId);
      expect(data.name).toEqual('Bob');
      expect(data.forums).toEqual([]);
    });
  });

  describe('mutation - joinForum', () => {
    const forumId = 'hey';
    const topic = 'hello';
    const userId = 'yop';

    beforeAll(() => {
      createRawUser(app, { id: userId });
      createRawForum(app, userId, { id: forumId, topic });
    });

    it('Should throw an error if user does not exist', async () => {
      query = joinForum(app);
      response = await query('some-id', forumId);
      expectNotFoundError(response, 'user');
    });

    it('Should throw an error if forum does not exist', async () => {
      query = joinForum(app);
      response = await query(userId, 'some-id');
      expectNotFoundError(response, 'forum');
    });

    it('Should add properly a forum to a user', async () => {
      // Before joining
      query = getOneUser(app);
      ({ data } = await query(userId));
      expect(data.forums).toEqual([]);

      // Joining
      query = joinForum(app);
      ({ data } = await query(userId, forumId));
      expect(data.id).toEqual(userId);

      // We find the forum inside the user data
      const [forum] = data.forums;
      expect(forum).toBeDefined();
      expect(forum.id).toEqual(forumId);
      expect(forum.topic).toEqual(topic);
      expect(forum.members.length).toEqual(1);
    });

    it('Should be able to join multiple forums', async () => {
      const batch = 10;

      query = joinForum(app);

      await Promise.all(
        new Array(batch).fill('').map((_, i) => {
          const id = `multiple-${i}`;

          // Create the forum in DB
          createRawForum(app, userId, { id });

          // Join the forum
          return query(userId, id);
        }),
      );

      // Fetch the user data
      query = getOneUser(app);
      ({ data } = await query(userId));

      // Count with one from previous test
      expect(data.forums.length).toEqual(batch + 1);
    });
  });
});
