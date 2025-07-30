import { IsEmail, IsNumber, IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/baseModel.entity';
import { emailVlidationMessage } from 'src/common/validation-message/email-validation.message';
import { lengthVlidationMessage } from 'src/common/validation-message/length-validation.message';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { Exclude } from 'class-transformer';
import { PostsModel } from 'src/posts/entity/post.entity';
import { AuthRequestModel } from '../auth-request/entity/auth-request.entity';

@Entity()
export class UsersModel extends BaseModel {
    @Column({ unique: true })
    @IsString()
    @Length(2, 20, { message: lengthVlidationMessage })
    nickname: string;

    @Column({ unique: true })
    @IsEmail({}, { message: emailVlidationMessage })
    @IsString()
    email: string;

    @Column()
    @IsString()
    @Exclude({ toPlainOnly: true })
    @Length(8, 30, { message: lengthVlidationMessage })
    password: string;

    @Column({
        type: 'enum',
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER,
    })
    role: RolesEnum;

    @OneToMany(() => PostsModel, (post) => post.author)
    posts: PostsModel[];

    @Column({ default: 0 })
    @IsNumber()
    postCount: number;

    @OneToMany(() => AuthRequestModel, (model) => model.from)
    AuthRequest: AuthRequestModel[];

    @OneToMany(() => AuthRequestModel, (model) => model.to)
    AuthResponse: AuthRequestModel;

    @Column({ default: 0 })
    @IsNumber()
    AuthResponseCount: number;

    @Column({ default: 0 })
    @IsNumber()
    AuthRequestCount: number;

    @Column({ default: 0 })
    @IsNumber()
    MutualRate: number;

    @Column({ default: 0 })
    @IsNumber()
    installCount: number;
}
