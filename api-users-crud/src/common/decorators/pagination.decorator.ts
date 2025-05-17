import { applyDecorators, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export type PaginationParams = {
    page: number;
    perPage: number;
};

export const Pagination = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return {
        page: request.query.page,
        perPage: request.query.perPage,
    };
});

export const HasPaginationQuery = () => {
    return applyDecorators(
        ApiQuery({ name: 'page', type: Number, required: false }),
        ApiQuery({ name: 'perPage', type: Number, required: false }),
    );
};
