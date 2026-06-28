import { BadRequestException, PipeTransform } from '@nestjs/common';
import { flattenError, ZodError, ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodObject) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);

      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          statusCode: 400,
          cause: flattenError(error),
        });
      }
    }
  }
}
