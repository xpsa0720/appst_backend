import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { notFoundUserException } from 'src/common/exception/not-found-user.exception';
import { UsersModel } from 'src/users/entity/user.entity';

export const User = createParamDecorator(
    (data: keyof UsersModel | undefined, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        const user = req.user;

        if (!user) {
            throw notFoundUserException();
        }

        if (data) {
            return user[data];
        }

        return user;
    },
);
