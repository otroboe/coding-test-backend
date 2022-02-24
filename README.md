# Coding Test Backend

## Requirements

### Node

- [Download](https://nodejs.org/en/download/)
- [Install via package manager](https://nodejs.org/en/download/package-manager/)
- [Node Version Manager](https://github.com/nvm-sh/nvm)

### Yarn

- [Install](https://classic.yarnpkg.com/en/docs/install/)

## Installation

```bash
yarn
```

## Running the app

- It will start the app on http://localhost:3000.
- A playground is available on http://localhost:3000/graphql to try it out.

```bash
# development
yarn start:dev

# production mode
yarn build
yarn start:prod
```

## Dev tools

```bash
# Check format errors
yarn format:check

# Check lint errors
yarn lint:check

# Check dead code
yarn tsprune

# Check all: format, lint, tsprune, tests
yarn check:all
```

## Test

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test:cov
```

## Resources

- [NestJS](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [ts-prune](https://github.com/nadeesha/ts-prune)

## GQL Schema

```graphql
scalar DateTime

type Forum {
  creator: User!
  id: ID!
  members: [User!]!
  messages: [Message!]!
  topic: String!
}

input ForumInput {
  topic: String!
}

type Message {
  content: String!
  createdAt: DateTime!
  creator: User!
  id: ID!
}

input MessageInput {
  content: String!
}

type Mutation {
  createForum(userId: String!, values: ForumInput!): Forum!
  joinForum(forumId: String!, userId: String!): User!
  postMessage(
    forumId: String!
    userId: String!
    values: MessageInput!
  ): Message!
}

type Query {
  forum(forumId: String!, userId: String!): Forum!
  forums: [Forum!]!
  user(id: String!): User!
}

type User {
  forums: [Forum!]!
  id: ID!
  name: String!
  picture: String
}
```
