import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tokenException } from 'src/common/exception/token.exception';
import { AuthService } from '../auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { publicRouteKey } from '../decorator/public-route.decorator';
import { UsersService } from 'src/users/users.service';
import { REFRESH_TOKEN_ROUTE_KEY } from '../decorator/refresh-token-route.decorator';

@Injectable()
export class BasicTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const rawToken = req.headers['authorization'];
        // console.log(req.headers['authorization']);
        if (!rawToken) {
            throw tokenException();
        }

        const IdandPassword = this.authService.extractToken(rawToken, true);
        const decodeIdandPassword = Buffer.from(
            IdandPassword,
            'base64',
        ).toString('utf8');

        const [email, password] = decodeIdandPassword.split(':');

        const user = await this.authService.authWithEmailAndPassword(
            email,
            password,
        );

        req.user = user;

        return true;
    }
}

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const rawToken = req.headers['authorization'];

        const isPublic = this.reflector.getAllAndOverride(publicRouteKey, [
            context.getHandler(),
            context.getClass(),
        ]);

        const isRefresh = this.reflector.getAllAndOverride(
            REFRESH_TOKEN_ROUTE_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            req.isPublic = true;
            return true;
        }
        if (isRefresh) {
            req.isRefresh = true;
        }
        if (!rawToken) {
            throw tokenException();
        }

        const token = this.authService.extractToken(rawToken, false);

        const { email, type } = this.authService.verifyToken(token);
        const user = await this.userService.findUserWithEmail(email);

        req.type = type;
        req.user = user;
        req.token = token;
        return true;
    }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();
        if (req.isPublic) {
            return true;
        }

        if (req.isRefresh) {
            return true;
        }

        if (req.type !== 'access') {
            throw tokenException();
        }

        return true;
    }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        const req = context.switchToHttp().getRequest();

        if (req.isPublic) {
            return true;
        }

        if (req.type !== 'refresh') {
            throw tokenException();
        }

        return true;
    }
}
