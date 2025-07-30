import { Column } from 'typeorm';
import { BaseModel } from './baseModel.entity';
import { IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { join } from 'path';
import {
    PUBLIC_AUTH_IMAGE_FOLDER_NAME,
    PUBLIC_AUTH_IMAGE_PATH,
} from '../const/path.const';

export enum ImageModelType {
    AUTH_IMAGE,
}

export class BaseImageModel extends BaseModel {
    @Column({ enum: ImageModelType })
    @IsEnum(ImageModelType)
    type: ImageModelType;

    @Column()
    @IsString()
    @Transform(({ value, obj }) => {
        const basePath = getImagePath(obj.type);
        return `\\${value}`;
    })
    path: string;
}

function getImagePath(type: ImageModelType): string {
    switch (type) {
        case ImageModelType.AUTH_IMAGE:
            return PUBLIC_AUTH_IMAGE_FOLDER_NAME;
        default:
            return '';
    }
}
