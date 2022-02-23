import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
