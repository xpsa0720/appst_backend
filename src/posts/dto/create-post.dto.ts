import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entity/post.entity';

export class CreatePostDto extends PickType(PostsModel, [
    'title',
    'content',
    'EmailGroupLink',
]) {}
