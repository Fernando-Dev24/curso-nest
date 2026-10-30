import {
  HttpException,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const http = host.switchToHttp();

    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[];

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const value = exceptionResponse.message;
      message =
        typeof value === 'string' ||
        (Array.isArray(value) &&
          value.every((item) => typeof item === 'string'))
          ? value
          : exception.message;
    } else {
      message = exception.message;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    });
  }
}
