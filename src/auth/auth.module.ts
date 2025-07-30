import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersModel } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthEmailModel } from './email-auth/entity/auth-email.entity';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([UsersModel, AuthEmailModel]),
        AuthEmailModel,
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, JwtService],
    exports: [AuthService],
})
export class AuthModule {}
