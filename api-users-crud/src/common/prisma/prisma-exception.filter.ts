import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        // eslint-disable-next-line
        const message = exception.message || exception?.toString();

        // console.error(JSON.stringify(message, null, 8));

        switch (exception.code) {
            case 'P2002':
                const p2002fields = (exception?.meta?.target as string[]).join(', ');

                // better phone number conflict error message
                if (p2002fields.includes('phone')) {
                    return response.status(HttpStatus.CONFLICT).json({
                        statusCode: HttpStatus.CONFLICT,
                        message: 'O número de telefone já está sendo utilizado em outra conta.',
                    });
                }

                const p2002message = `Os campos [${p2002fields}] já estão em uso.`;

                return response.status(HttpStatus.CONFLICT).json({
                    statusCode: HttpStatus.CONFLICT,
                    message: p2002message,
                });
            case 'P2025':
                return response.status(HttpStatus.NOT_FOUND).json({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Registro não encontrado.',
                });
            default:
                return response.status(HttpStatus.BAD_REQUEST).json({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message,
                });
        }
    }
}
