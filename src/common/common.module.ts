import { BadGatewayException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import multer from 'multer';
import { PUBLIC_AUTH_IMAGE_PATH } from './const/path.const';
import {v4 as uuid}from 'uuid'
@Module({
    imports: [
        
    ],
    controllers: [CommonController],
    providers: [CommonService],
})
export class CommonModule {}
