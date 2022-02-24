# Changes

## Part 2 preparation

### GraphQL Schema

```graphql
scalar DateTime

type Forum {
  creator: User!
  id: ID!
  isPrivate: Boolean!
  members: [User!]!
  messages: [Message!]!
  requests: [ForumRequest!]
  topic: String!
}

input ForumInput {
  isPrivate: Boolean!
  topic: String!
}

type ForumRequest {
  createdBy: User!
  id: ID!
  status: ForumRequestStatus!
  type: ForumRequestType!
}

enum ForumRequestStatus {
  APPROVED
  PENDING
  REJECTED
}

enum ForumRequestType {
  JOIN
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
  approveForumRequest(requestId: String!, userId: String!): Boolean!
  createForum(userId: String!, values: ForumInput!): Forum!
  joinForum(forumId: String!, userId: String!): User!
  postMessage(
    forumId: String!
    userId: String!
    values: MessageInput!
  ): Message!
  rejectForumRequest(requestId: String!, userId: String!): Boolean!
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
