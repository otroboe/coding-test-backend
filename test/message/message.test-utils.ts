import { INestApplication } from '@nestjs/common';

import { MessageInput } from '../../src/message/dto/message.dto';
import { formatResponse, gql } from '../utils/query';

const messageFields = `
  id
  content
  createdAt
  creator {
    id
    name
    picture
  }
`;

export const postMessage = (app: INestApplication) => {
  return async (
    userId: string,
    forumId: string,
    values: MessageInput,
  ): Promise<any> => {
    const query = `
      mutation (
        $userId: String!
        $forumId: String!
        $values: MessageInput!
      ) {
        postMessage (
          userId: $userId
          forumId: $forumId
          values: $values
        ) {
          ${messageFields}
        }
      }
    `;
    const response = await gql(app)(query, { userId, forumId, values });

    return formatResponse(response, 'postMessage');
  };
};
