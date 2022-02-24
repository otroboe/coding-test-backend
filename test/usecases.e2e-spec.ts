import { INestApplication } from '@nestjs/common';

import { User } from '../src/user/models/user.model';
import { createForum, getOneForum } from './forum/forum.test-utils';
import { postMessage } from './message/message.test-utils';
import { getOneUser, joinForum } from './user/user.test-utils';
import { createRawUser } from './utils/database';
import { expectForbiddenError } from './utils/errors';
import { initTestSuite } from './utils/tools';

/**
 * The DB is not reset between tests, and it's on purpose
 */
describe('Usecases - Happy paths!', () => {
  let app: INestApplication;
  let close: () => Promise<void>;
  let data: Record<string, any>;
  let jane: User;
  let janesForumId: string;
  let john: User;
  let johnsForumId: string;
  let query: any;
  let response: Record<string, any>;

  beforeAll(async () => {
    ({ app, close } = await initTestSuite());

    john = createRawUser(app, { name: 'John' });
    jane = createRawUser(app, { name: 'Jane' });
  });

  afterAll(async () => {
    await close();
  });

  describe('John create a forum and post some messages inside', () => {
    it('Create the forum', async () => {
      query = createForum(app);

      ({ data } = await query(john.id, { topic: 'cinema' }));
      johnsForumId = data.id;

      expect(data.creator.name).toEqual(john.name);
      expect(data.messages.length).toEqual(0);
    });

    it('Post messages in the forum', async () => {
      query = postMessage(app);

      ({ data } = await query(john.id, johnsForumId, { content: 'hello!' }));
      expect(data.content).toEqual('hello!');
      expect(data.creator.name).toEqual(john.name);

      ({ data } = await query(john.id, johnsForumId, { content: 'world!' }));
      expect(data.content).toEqual('world!');
      expect(data.creator.name).toEqual(john.name);
    });

    it('Check messages in the forum', async () => {
      query = getOneForum(app);

      ({ data } = await query(john.id, johnsForumId));
      expect(data.messages.length).toEqual(2);

      // First message in the list is the last message
      expect(data.messages[0].content).toEqual('world!');
    });
  });

  describe('Jane create a forum and post some messages inside', () => {
    it('Create the forum', async () => {
      query = createForum(app);

      ({ data } = await query(jane.id, { topic: 'music' }));
      janesForumId = data.id;

      expect(data.creator.name).toEqual(jane.name);
      expect(data.messages.length).toEqual(0);
    });

    it('Post messages in the forum', async () => {
      query = postMessage(app);

      ({ data } = await query(jane.id, janesForumId, { content: 'samba!' }));
      expect(data.content).toEqual('samba!');
      expect(data.creator.name).toEqual(jane.name);

      ({ data } = await query(jane.id, janesForumId, { content: 'disco!' }));
      expect(data.content).toEqual('disco!');
      expect(data.creator.name).toEqual(jane.name);

      ({ data } = await query(jane.id, janesForumId, { content: 'rock!' }));
      expect(data.content).toEqual('rock!');
      expect(data.creator.name).toEqual(jane.name);
    });

    it('Check messages in the forum', async () => {
      query = getOneForum(app);

      ({ data } = await query(jane.id, janesForumId));
      expect(data.messages.length).toEqual(3);

      // First message in the list is the last message
      expect(data.messages[0].content).toEqual('rock!');
    });
  });

  describe("John is joining Jane's forum and post a message", () => {
    it('John has only one forum in his list', async () => {
      query = getOneUser(app);

      ({ data } = await query(john.id));
      expect(data.forums.length).toEqual(1);
      expect(data.forums[0].topic).toEqual('cinema');
    });

    it("John tries to post in Jane's forum but he can't", async () => {
      query = postMessage(app);

      response = await query(john.id, janesForumId, {
        content: 'I love music too!',
      });
      expectForbiddenError(response, 'join');
    });

    it("John joins Jane's forum and he can post a message", async () => {
      query = joinForum(app);
      await query(john.id, janesForumId);

      query = postMessage(app);
      ({ data } = await query(john.id, janesForumId, {
        content: 'I love music?',
      }));
    });

    it('Jane checks her forum', async () => {
      query = getOneForum(app);

      ({ data } = await query(jane.id, janesForumId));
      expect(data.messages.length).toEqual(4);
      expect(data.messages[0].content).toEqual('I love music?');
      expect(data.members.length).toEqual(2);

      // Members are not sorted, order can't be trusted
      // But we can find John in the list
      expect(
        data.members.find(
          (member: Record<string, any>) => member.id === john.id,
        ),
      ).toBeDefined();
    });
  });
});
