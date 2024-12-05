import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import AppError from './AppError';
import ApiResponse from './ApiResponse';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: ApiResponse<null>;

    if (exception instanceof HttpException) {
      // Handle built-in NestJS HttpExceptions
      httpStatus = exception.getStatus();
      const response = exception.getResponse();

      responseBody = new ApiResponse(
        httpStatus,
        typeof response === 'string'
          ? response
          : (response as any).message || 'Error',
        httpAdapter.getRequestUrl(ctx.getRequest()), // Path
        null, // Data
      );
    } else if (exception instanceof AppError) {
      // Handle custom AppError
      httpStatus = exception.statusCode;

      responseBody = new ApiResponse(
        httpStatus,
        exception.isOperational
          ? exception.message
          : 'Unexpected error occurred',
        httpAdapter.getRequestUrl(ctx.getRequest()), // Path
        null, // Data
      );

      if (!exception.isOperational) {
        console.error('Non-operational AppError:', exception); // Log non-operational errors
      }
    } else {
      // Handle unexpected errors
      console.error('Unhandled exception:', exception);

      responseBody = new ApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'An unexpected error occurred.',
        httpAdapter.getRequestUrl(ctx.getRequest()), // Path
        null, // Data
      );
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
