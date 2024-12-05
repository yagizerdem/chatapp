import {
  ArgumentMetadata,
  Injectable,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const errorMessages = errors.map((error) => {
          if (error.constraints) {
            return Object.values(error.constraints);
          }
          return [];
        });
        return new BadRequestException(errorMessages.flat());
      },
    });
  }
}
