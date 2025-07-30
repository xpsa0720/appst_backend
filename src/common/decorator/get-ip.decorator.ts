import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const GetIp = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest() as Request;
        if (!req.ip) {
            throw new InternalServerErrorException('ip is not found');
        }
        return req.ip === '::1' ? '127.0.0.1' : req.ip;
    },
);
