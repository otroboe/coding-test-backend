import { INestApplication } from '@nestjs/common';

import { ForumInput } from '../../src/forum/dto/forum.dto';
import { formatResponse, gql } from '../utils/query';

const forumFields = `
  id
  topic
  creator {
    id
    name
    picture
  }
  members {
    id
    name
    picture
  }
  messages {
    id
    content
    creator {
      name
      picture
    }
  }
`;

export const getForums = (app: INestApplication) => {
  return async (): Promise<any> => {
    const query = `
      query {
        forums {
          ${forumFields}
        }
      }
    `;
    const response = await gql(app)(query);

    return formatResponse(response, 'forums');
  };
};

export const getOneForum = (app: INestApplication) => {
  return async (userId: string, forumId: string): Promise<any> => {
    const query = `
      query (
        $userId: String!
        $forumId: String!
      ) {
        forum (
          userId: $userId
          forumId: $forumId
        ) {
          ${forumFields}
        }
      }
    `;
    const response = await gql(app)(query, { userId, forumId });

    return formatResponse(response, 'forum');
  };
};

export const createForum = (app: INestApplication) => {
  return async (userId: string, values: ForumInput): Promise<any> => {
    const query = `
      mutation (
        $userId: String!
        $values: ForumInput!
      ) {
        createForum (
          userId: $userId
          values: $values
        ) {
          ${forumFields}
        }
      }
    `;
    const response = await gql(app)(query, { userId, values });

    return formatResponse(response, 'createForum');
  };
};
