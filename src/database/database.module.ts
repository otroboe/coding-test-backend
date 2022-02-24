import { Module } from '@nestjs/common';

import { DatabaseService } from './database.service';
import { FixturesService } from './fixtures.service';

@Module({
  providers: [DatabaseService, FixturesService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
