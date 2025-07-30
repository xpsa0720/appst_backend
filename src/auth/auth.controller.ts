import {
    Body,
    Controller,
    Get,
    Injectable,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import {
    BasicTokenGuard,
    BearerTokenGuard,
    RefreshTokenGuard,
} from './guard/token.guard';
import { User } from './decorator/user.decorator';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { PublicRoute } from './decorator/public-route.decorator';
import { GetIp } from 'src/common/decorator/get-ip.decorator';
import { GetRefreshToken } from './decorator/get-token-decorator';
import { RfreshTokenRoute } from './decorator/refresh-token-route.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {}

    @Post('token')
    @RfreshTokenRoute()
    postRotateRefreshToken(@User() user: UsersModel) {
        return { accessToken: this.authService.createAccessToken(user) };
    }

    @Post('register')
    @PublicRoute()
    postRegisterUser(@Body(ValidationPipe) dto: CreateUserDto) {
        return this.authService.createUser(dto);
    }

    @Post('login')
    @PublicRoute()
    @UseGuards(BasicTokenGuard)
    postLoginWithEmail(@User() user: UsersModel) {
        return this.authService.loginWithEmail(user);
    }

    @Post()
    getMe(@User() user: UsersModel) {
        return { id: user.id, ninkName: user.nickname };
    }
}
