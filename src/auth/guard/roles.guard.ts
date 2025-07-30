import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from '../decorator/role.decorator';
import { UsersModel } from 'src/users/entity/user.entity';
import { RolesEnum } from 'src/users/const/roles.const';
import { permissionException } from 'src/common/exception/permission.exception';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest() as Request & {
            user: UsersModel;
        };
        const RequiredRole = this.reflector.getAllAndOverride(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) as RolesEnum;

        if (!RequiredRole) {
            return true;
        }

        if (req.user.role === RolesEnum.ADMIN) {
            return true;
        }

        if (req.user.role !== RequiredRole) {
            throw permissionException();
        }

        return true;
    }
}
