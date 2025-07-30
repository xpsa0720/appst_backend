import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common';

export const GetQueryRunner = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();

        if (!req.QueryRunner) {
            throw new InternalServerErrorException('QueryRunner not found');
        }

        return req.QueryRunner;
    },
);
