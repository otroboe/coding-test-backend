import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { ForumResolver } from './forum.resolver';
import { ForumService } from './forum.service';

@Module({
  imports: [DatabaseModule],
  providers: [ForumService, ForumResolver],
  exports: [ForumService],
})
export class ForumModule {}
