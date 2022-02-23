import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { ValidationMutationPipe } from '../common/validation-mutation.pipe';
import { User } from '../user/models/user.model';
import { MessageInput } from './dto/message.dto';
import { MessageService } from './message.service';
import { Message } from './models/message.model';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @ResolveField('creator', () => User)
  getCreator(@Parent() message: Message): User {
    return this.messageService.getCreator(message);
  }

  @Mutation(() => Message, { name: 'postMessage' })
  createOne(
    @Args('userId') userId: string,
    @Args('forumId') forumId: string,
    @Args(
      { name: 'values', type: () => MessageInput },
      new ValidationMutationPipe<MessageInput>(MessageInput),
    )
    input: MessageInput,
  ): Message {
    return this.messageService.createOne(userId, forumId, input);
  }
}
