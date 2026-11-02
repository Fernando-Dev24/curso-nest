import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    let httpException: ConflictException | NotFoundException;

    switch (exception.code) {
      case 'P2002':
        httpException = new ConflictException(
          'Ya existe un registro con esos datos único.',
        );
        break;
      case 'P2003':
        httpException = new ConflictException(
          'La operación viola una relación existente.',
        );
        break;
      case 'P2025':
        httpException = new NotFoundException(
          'No se encontró el registro solicitado.',
        );
        break;
      default:
        throw exception;
    }

    const response = host.switchToHttp().getResponse();

    response
      .status(httpException.getStatus())
      .json(httpException.getResponse());
  }
}
