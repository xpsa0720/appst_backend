import { BaseImageModel } from 'src/common/entity/base-image-model.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { AuthRequestModel } from './auth-request.entity';

@Entity()
export class AuthRequestImageModel extends BaseImageModel {
    @OneToOne(() => AuthRequestModel, (model) => model.image)
    auth_request?: AuthRequestModel;
}
