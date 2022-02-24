import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export const gql = (app: INestApplication) => {
  return async (
    query: string,
    variables: Record<string, any> = {},
  ): Promise<request.Response> =>
    request(app.getHttpServer()).post('/graphql').send({ query, variables });
};

export const formatResponse = (
  response: Record<string, any>,
  operationName: string,
): Record<string, any> => {
  const data = response.body.data?.[operationName];

  return {
    response,
    status: response.status,
    data: data ?? null,
    errors: response.body.errors,
  };
};
