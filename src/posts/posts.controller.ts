import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { QueryRunner, Transaction } from 'typeorm';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';
import { GetQueryRunner } from '../common/decorator/get-queryrunner.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/auth/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/user.entity';
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    getPosts() {
        return this.postsService.getAllPost();
    }

    @Post()
    @UseInterceptors(TransactionInterceptor)
    postPosts(
        @GetQueryRunner() qr: QueryRunner,
        @Body() dto: CreatePostDto,
        @User() user: UsersModel,
    ) {
        return this.postsService.createPost(qr, dto, user);
    }

    @Delete(':postId')
    @UseInterceptors(TransactionInterceptor)
    deletePost(
        @Param('postId', ParseIntPipe) id: number,
        @User() user,
        @GetQueryRunner() qr: QueryRunner,
    ) {
        return this.postsService.deletePost(id, user, qr);
    }
}
