import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    Logger.error(
      `${request.method} ${request.url}, encountered an exception: ${exception.message}`,
      exception.stack,
    );

    const exceptionResponse = exception.getResponse();
    const errorPayload =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : exceptionResponse;

    response.status(status).json({
      ...errorPayload,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
