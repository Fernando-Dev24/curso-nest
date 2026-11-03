import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization'];

    if (!token || token !== 'Bearer mock-access-token') {
      throw new UnauthorizedException('Invalid or missing authorization token');
    }

    return true;
  }
}
