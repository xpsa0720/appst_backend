import { BadGatewayException, Module } from '@nestjs/common';
import { AuthRequestService } from './auth-request.service';
import { AuthRequestController } from './auth-request.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import {
    PROJECT_PUBLIC_PATH,
    PUBLIC_AUTH_IMAGE_PATH,
} from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';
import { AuthRequestModel } from './entity/auth-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from '../entity/user.entity';
import { AuthRequestImageModel } from './entity/auth-request-image.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            AuthRequestModel,
            UsersModel,
            AuthRequestImageModel,
        ]),
        AuthRequestModel,
        UsersModel,
        AuthRequestImageModel,
        MulterModule.register({
            limits: {
                fileSize: 10000000,
            },
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname);
                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                    return cb(
                        new BadGatewayException(
                            'jpg/jpeg/png 파일만 업로드 가능합니다',
                        ),
                        false,
                    );
                }
                return cb(null, true);
            },
            storage: multer.diskStorage({
                destination: function (req, res, cb) {
                    cb(null, PUBLIC_AUTH_IMAGE_PATH);
                },
                filename: function (req, file, cb) {
                    cb(null, `${uuid()}${extname(file.originalname)}`);
                },
            }),
        }),
    ],
    controllers: [AuthRequestController],
    providers: [AuthRequestService],
})
export class AuthRequestModule {}
