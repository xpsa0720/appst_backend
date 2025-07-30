import { IsEmail, IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/baseModel.entity';
import { UsersModel } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
    @Column()
    @IsString()
    title: string;

    @Column()
    @IsString()
    content: string;

    @Column()
    @IsEmail()
    EmailGroupLink: string;

    @ManyToOne(() => UsersModel, (user) => user.posts)
    author: UsersModel;
}
