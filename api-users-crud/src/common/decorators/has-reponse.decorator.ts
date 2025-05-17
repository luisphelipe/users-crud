import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { ValidationErrorResponseDto } from '../dto/validation-error-response.dto';

type SwaggerParams = {
    type?: any;
    description?: string;
};

type DescriptionParam = Pick<SwaggerParams, 'description'>;

export function HasSuccessResponse(
    { type, description }: SwaggerParams = {
        type: MessageResponseDto,
        description: 'on success',
    },
) {
    return applyDecorators(
        ApiOkResponse({
            type,
            description,
        }),
    );
}

export function HasCreatedResponse(
    { type, description }: SwaggerParams = {
        type: MessageResponseDto,
        description: 'on success',
    },
) {
    return applyDecorators(
        ApiCreatedResponse({
            type,
            description,
        }),
    );
}

export function HasBadRequestResponse(
    { description }: DescriptionParam = {
        description: 'when input is invalid',
    },
) {
    return applyDecorators(
        ApiBadRequestResponse({
            type: ValidationErrorResponseDto,
            description,
        }),
    );
}

export function HasUnauthorizedResponse(
    { description }: DescriptionParam = {
        description: 'when user is not authenticated',
    },
) {
    return applyDecorators(
        ApiUnauthorizedResponse({
            type: ErrorResponseDto,
            description,
        }),
    );
}

export function HasNotFoundResponse(
    { entity }: { entity: string } = {
        entity: 'user',
    },
) {
    const description = `when ${entity} is not found`;
    return applyDecorators(
        ApiNotFoundResponse({
            type: ErrorResponseDto,
            description,
        }),
    );
}

export function HasBearerAuthentication(
    { description }: DescriptionParam = {
        description: 'when user is not authenticated',
    },
) {
    return applyDecorators(
        ApiBearerAuth(),
        ApiUnauthorizedResponse({
            type: ErrorResponseDto,
            description,
        }),
    );
}
