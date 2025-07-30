import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersModel } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthRequestModel } from './auth-request/entity/auth-request.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersModel, AuthRequestModel]),
        UsersModel,
        AuthRequestModel,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
