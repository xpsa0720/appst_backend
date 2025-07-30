import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    ENV_DB_DATABASE_KEY,
    ENV_DB_HOST_KEY,
    ENV_DB_PASSWORD_KEY,
    ENV_DB_PORT_KEY,
    ENV_DB_USERNAME_KEY,
} from './common/const/env.keys.const';
import { ConfigModule } from '@nestjs/config';
import { BaseModel } from './common/entity/baseModel.entity';
import { UsersModel } from './users/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guard/token.guard';
import { RolesGuard } from './auth/guard/roles.guard';
import { PostsModule } from './posts/posts.module';
import { PostsModel } from './posts/entity/post.entity';
import { EmailAuthModule } from './auth/email-auth/email-auth.module';
import { AuthEmailModel } from './auth/email-auth/entity/auth-email.entity';
import { AuthRequestModule } from './users/auth-request/auth-request.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PROJECT_PUBLIC_PATH } from './common/const/path.const';
import { AuthRequestModel } from './users/auth-request/entity/auth-request.entity';
import { AuthRequestImageModel } from './users/auth-request/entity/auth-request-image.entity';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: PROJECT_PUBLIC_PATH,
            serveRoot: '/public',
        }),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        UsersModule,
        CommonModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env[ENV_DB_HOST_KEY],
            port: parseInt(process.env[ENV_DB_PORT_KEY]!),
            username: process.env[ENV_DB_USERNAME_KEY]!,
            password: process.env[ENV_DB_PASSWORD_KEY]!,
            database: process.env[ENV_DB_DATABASE_KEY]!,
            synchronize: true,
            entities: [
                UsersModel,
                PostsModel,
                AuthEmailModel,

                AuthRequestModel,
                AuthRequestImageModel,
            ],
        }),
        AuthModule,
        PostsModule,
        EmailAuthModule,
        AuthRequestModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
        { provide: APP_GUARD, useClass: AccessTokenGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
})
export class AppModule {}
