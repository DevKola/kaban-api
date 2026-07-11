import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data: ApiResponse<T>) => {
        const statusCode = response.statusCode;

        // If the controller already returned a shaped envelope, pass it through
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Use the @ResponseMessage() decorator value if set, otherwise derive one
        const customMessage = this.reflector.getAllAndOverride<string>(
          RESPONSE_MESSAGE_KEY,
          [context.getHandler(), context.getClass()],
        );
        const message =
          customMessage ?? deriveMessage(request.method, statusCode);

        return {
          success: true,
          statusCode,
          message,
          data: data ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}

function deriveMessage(method: string, statusCode: number): string {
  if (statusCode === 201) return 'Created successfully';
  if (statusCode === 204) return 'Deleted successfully';

  switch (method.toUpperCase()) {
    case 'GET':
      return 'Retrieved successfully';
    case 'POST':
      return 'Created successfully';
    case 'PATCH':
    case 'PUT':
      return 'Updated successfully';
    case 'DELETE':
      return 'Deleted successfully';
    default:
      return 'Request processed successfully';
  }
}
