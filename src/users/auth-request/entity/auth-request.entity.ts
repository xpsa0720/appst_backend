import { BaseModel } from 'src/common/entity/baseModel.entity';
import { BaseImageModel } from 'src/common/entity/base-image-model.entity';
import { UsersModel } from 'src/users/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AuthRequestImageModel } from './auth-request-image.entity';

@Entity()
export class AuthRequestModel extends BaseModel {
    @ManyToOne(() => UsersModel, (user) => user.AuthRequest)
    from: UsersModel;

    @ManyToOne(() => UsersModel, (user) => user.AuthResponse)
    to: UsersModel;

    @OneToOne(() => AuthRequestImageModel, (image) => image.auth_request, {
        cascade: true,
        eager: true,
    })
    @JoinColumn()
    image: AuthRequestImageModel;

    @Column({ default: false })
    confirm: boolean;
}
