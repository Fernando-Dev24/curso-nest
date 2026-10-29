import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

const API_KEY = 'nestjs-v12-secret';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];

    /* if (!apiKey || apiKey !== API_KEY) {
      return false;
    } */

    return apiKey === API_KEY;
  }
}
