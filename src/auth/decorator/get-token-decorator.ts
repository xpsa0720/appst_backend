import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { notFoundUserException } from 'src/common/exception/not-found-user.exception';
import { tokenException } from 'src/common/exception/token.exception';
import { UsersModel } from 'src/users/entity/user.entity';

export const GetAccessToken = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        const token = req.token;
        const token_type = req.type;

        if (!token) {
            throw tokenException();
        }

        if (token_type !== 'accessToken') {
            throw tokenException();
        }

        return token;
    },
);

export const GetRefreshToken = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        const token = req.token;
        const token_type = req.type;

        if (!token) {
            throw tokenException();
        }

        if (token_type !== 'refresh') {
            throw tokenException();
        }

        return token;
    },
);
