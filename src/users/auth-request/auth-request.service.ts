import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersModel } from '../entity/user.entity';
import { AuthRequestDto } from './dto/auth-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRequestModel } from './entity/auth-request.entity';
import { QueryRunner, Repository } from 'typeorm';
import { notFoundUserException } from 'src/common/exception/not-found-user.exception';
import { AuthRequestImageModel } from './entity/auth-request-image.entity';
import { ImageModelType } from 'src/common/entity/base-image-model.entity';
import { GetQueryRunner } from 'src/common/decorator/get-queryrunner.decorator';

@Injectable()
export class AuthRequestService {
    constructor(
        @InjectRepository(AuthRequestModel)
        private readonly authRequestRepository: Repository<AuthRequestModel>,
        @InjectRepository(UsersModel)
        private readonly userRepository: Repository<UsersModel>,
        @InjectRepository(AuthRequestImageModel)
        private readonly authRequestImageRepository: Repository<AuthRequestImageModel>,
    ) {}

    getAuthRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository(AuthRequestModel)
            : this.authRequestRepository;
    }

    getUserRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository(UsersModel) : this.userRepository;
    }

    getAuthImageRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository(AuthRequestImageModel)
            : this.authRequestImageRepository;
    }

    async authRequest(
        fromUser: UsersModel,
        dto: AuthRequestDto,
        image: Express.Multer.File,
        qr?: QueryRunner,
    ) {
        const userRepository = this.getUserRepository(qr);
        const authRequestRepository = this.getAuthRepository(qr);
        const authImageRepository = this.getAuthImageRepository(qr);

        const ToUser = await userRepository.findOne({
            where: { id: dto.to_userId },
        });

        if (!ToUser) {
            throw notFoundUserException();
        }

        const newAuthRequest = await authRequestRepository.create({
            from: fromUser,
            to: ToUser,
        });

        const newImage = await authImageRepository.create({
            path: image.path,
            type: ImageModelType.AUTH_IMAGE,
        });

        const saveRequest = await authRequestRepository.save({
            ...newAuthRequest,
            image: newImage,
        });

        await this.authRequestImageRepository.save({
            ...newImage,
            auth_request: newAuthRequest,
        });

        this.incrementRequestCount(fromUser, qr);
        this.incrementResponseCount(ToUser, qr);

        return saveRequest;
    }

    async getConfirmRequest(fromUser: UsersModel) {
        return await this.authRequestRepository.find({
            where: { from: { id: fromUser.id }, confirm: true },
        });
    }

    async getConfirmResponse(fromUser: UsersModel) {
        return await this.authRequestRepository.find({
            where: { to: { id: fromUser.id }, confirm: true },
        });
    }

    async getAuthRequest(fromUser: UsersModel) {
        return await this.authRequestRepository.find({
            where: { from: { id: fromUser.id }, confirm: false },
        });
    }

    async getAuthResponse(fromUser: UsersModel) {
        return await this.authRequestRepository.find({
            where: { to: { id: fromUser.id }, confirm: false },
        });
    }

    async AuthConfirm(user: UsersModel, id: number, qr?: QueryRunner) {
        const repository = this.getAuthRepository(qr);
        const authRequest = await repository.findOne({
            where: { id, to: { id: user.id } },
            relations: {
                from: true,
                to: true,
            },
        });

        if (!authRequest) {
            throw new BadRequestException('요청하신 인증이 없습니다!');
        }

        authRequest.confirm = true;

        await repository.save(authRequest);
        await this.SuccessAuth(user, qr);
        return true;
    }

    async SuccessAuth(user: UsersModel, qr?: QueryRunner) {
        await this.incrementInstallCount(user, qr);
        await this.decrementResponseCount(user, qr);
    }

    async incrementInstallCount(user: UsersModel, qr?: QueryRunner) {
        const repository = this.getUserRepository(qr);
        await repository.increment({ id: user.id }, 'installCount', 1);
    }

    async incrementRequestCount(user: UsersModel, qr?: QueryRunner) {
        const repository = this.getUserRepository(qr);
        await repository.increment({ id: user.id }, 'AuthRequestCount', 1);
    }
    async incrementResponseCount(user: UsersModel, qr?: QueryRunner) {
        const repository = this.getUserRepository(qr);
        await repository.increment({ id: user.id }, 'AuthResponseCount', 1);
    }

    async decrementRequestCount(user: UsersModel, qr?: QueryRunner) {
        const repository = this.getUserRepository(qr);
        await repository.decrement({ id: user.id }, 'AuthRequestCount', 1);
    }
    async decrementResponseCount(user: UsersModel, qr?: QueryRunner) {
        const repository = this.getUserRepository(qr);
        await repository.decrement({ id: user.id }, 'AuthResponseCount', 1);
    }
}
