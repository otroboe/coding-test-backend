import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ForumModule } from './forum/forum.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule,
    ForumModule,
    MessageModule,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      driver: ApolloDriver,
      include: [ForumModule, MessageModule, UserModule],
      sortSchema: true,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
