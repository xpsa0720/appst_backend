import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsModel } from './entity/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PostsModel, UsersModel]),
        PostsModel,
        UsersModel,
    ],

    controllers: [PostsController],
    providers: [PostsService],
    exports: [PostsService, PostsModel],
})
export class PostsModule {}
