import { BadGatewayException, Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entity/post.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersModel } from 'src/users/entity/user.entity';
import { notFoundPostException } from 'src/common/exception/not-found-post.exception';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsModel)
        private readonly postsRepository: Repository<PostsModel>,
        @InjectRepository(UsersModel)
        private readonly userRepository: Repository<UsersModel>,
    ) {}

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<PostsModel>(PostsModel)
            : this.postsRepository;
    }
    getUserRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<UsersModel>(UsersModel)
            : this.userRepository;
    }

    createPost(qr: QueryRunner, dto: CreatePostDto, user: UsersModel) {
        const repository = this.getRepository(qr);

        repository.save({ ...dto, author: user });
        this.incrementPostsCount(user, qr);
        // throw new BadGatewayException();
        return true;
    }

    getAllPost() {
        return this.postsRepository.find({ relations: { author: true } });
    }

    async deletePost(postId: number, user: UsersModel, qr: QueryRunner) {
        const repository = this.getRepository(qr);
        const exist = await repository.exists({
            where: { id: postId, author: { id: user.id } },
        });

        if (!exist) {
            throw notFoundPostException();
        }
        this.decrementPostsCount(user, qr);

        repository.delete({ id: postId });
        return true;
    }

    async incrementPostsCount(user: UsersModel, qr?: QueryRunner) {
        const repository = this.getUserRepository(qr);
        await repository.increment({ id: user.id }, 'postCount', 1);
    }

    async decrementPostsCount(user: UsersModel, qr?: QueryRunner) {
        const repository = this.getUserRepository(qr);
        await repository.decrement({ id: user.id }, 'postCount', 1);
    }
}
