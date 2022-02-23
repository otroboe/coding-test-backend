import { INestApplication } from '@nestjs/common';

import { formatResponse, gql } from '../utils/query';

const userFields = `
  id
  name
  picture
  forums {
    id
    topic
    members {
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
  }
`;

export const getOneUser = (app: INestApplication) => {
  return async (id: string): Promise<any> => {
    const query = `
      query ($id: String!) {
        user (id: $id) {
          ${userFields}
        }
      }
    `;
    const response = await gql(app)(query, { id });

    return formatResponse(response, 'user');
  };
};

export const joinForum = (app: INestApplication) => {
  return async (userId: string, forumId: string): Promise<any> => {
    const query = `
      mutation (
        $userId: String!
        $forumId: String!
      ) {
        joinForum (
          userId: $userId
          forumId: $forumId
        ) {
          ${userFields}
        }
      }
    `;
    const response = await gql(app)(query, { userId, forumId });

    return formatResponse(response, 'joinForum');
  };
};
