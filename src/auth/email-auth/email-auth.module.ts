import { Module } from '@nestjs/common';
import { EmailAuthService } from './email-auth.service';
import { EmailAuthController } from './email-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEmailModel } from './entity/auth-email.entity';
import { UsersModel } from 'src/users/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthEmailModel, UsersModel]),
        AuthEmailModel,

        UsersModel,
    ],
    controllers: [EmailAuthController],
    providers: [EmailAuthService],
})
export class EmailAuthModule {}
