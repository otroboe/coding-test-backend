import { BadRequestException, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidationMutationPipe<T> implements PipeTransform<T> {
  private readonly dtoClassRef: any;

  constructor(dtoClassRef: unknown) {
    this.dtoClassRef = dtoClassRef;
  }

  async transform(value: T): Promise<Record<string, any>> {
    const object = plainToClass<Record<string, any>, T>(
      this.dtoClassRef,
      value,
    );
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException({ errors });
    }

    return object;
  }
}
