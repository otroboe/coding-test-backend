import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { ForumModule } from '../forum/forum.module';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

@Module({
  imports: [DatabaseModule, ForumModule],
  providers: [MessageResolver, MessageService],
})
export class MessageModule {}
