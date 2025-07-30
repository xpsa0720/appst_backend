import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ENV_HASH_ROUNDS_KEY,
    ENV_JWT_SECRET,
} from 'src/common/const/env.keys.const';
import { UsersModel } from 'src/users/entity/user.entity';
import { BSON, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { notFoundUserException } from 'src/common/exception/not-found-user.exception';
import { tokenException } from 'src/common/exception/token.exception';
import { JwtService } from '@nestjs/jwt';
import { AuthEmailModel } from './email-auth/entity/auth-email.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly userRepository: Repository<UsersModel>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectRepository(AuthEmailModel)
        private readonly authEmailRepository: Repository<AuthEmailModel>,
    ) {}
    //---------------------------------엔드포인트 로직-------------------------------------
    //엔드포인트 인증
    async loginWithEmail(user: UsersModel) {
        const find_user = await this.userRepository.findOne({
            where: { email: user.email, password: user.password },
        });

        if (!find_user) {
            throw notFoundUserException();
        }

        return this.LoginSuccess(find_user);
    }

    // 회원가입
    async createUser(dto: CreateUserDto) {
        const existAuthEmail = await this.authEmailRepository.exists({
            where: { email: dto.email },
        });

        if (!existAuthEmail) {
            throw new BadRequestException('인증되지 않은 이메일 입니다!');
        }

        const emailExists = await this.userRepository.exists({
            where: { email: dto.email },
        });

        if (emailExists) {
            throw new BadRequestException('이미 존재하는 이메일 입니다!');
        }

        const ninknameExists = await this.userRepository.exists({
            where: { nickname: dto.nickname },
        });

        if (ninknameExists) {
            throw new BadRequestException('이미 존재하는 닉네임 입니다!');
        }

        const rounds = parseInt(
            this.configService.get<string>(ENV_HASH_ROUNDS_KEY)!,
        );
        const hash = await bcrypt.hash(dto.password, rounds);

        const newUser = await this.userRepository.save({
            ...dto,
            password: hash,
        });

        await this.authEmailRepository.delete({
            email: dto.email,
        });

        return this.LoginSuccess(newUser);
    }

    //-----------------------------유틸------------------------------------------

    // 이메일과 비밀번호로 인증
    async authWithEmailAndPassword(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });

        if (!user) {
            throw notFoundUserException();
        }

        const pass = await bcrypt.compare(password, user.password);

        if (!pass) {
            throw notFoundUserException();
        }
        return user;
    }

    // 로그인 성공
    async LoginSuccess(user: UsersModel) {
        return {
            accessToken: this.createAccessToken(user),
            refreshToken: this.createRefreshToken(user),
        };
    }
    async logOut(token: string) {
        const payload = this.verifyToken(token);

        return true;
    }

    // ----------------------------------토큰 로직----------------------------------------------
    createAccessToken(user: Pick<UsersModel, 'email' | 'id'>) {
        const data = { ...user, type: 'access' };
        return this.jwtService.sign(data, {
            secret: this.configService.get<string>(ENV_JWT_SECRET),
            expiresIn: 300,
        });
    }

    createRefreshToken(user: Pick<UsersModel, 'email' | 'id'>) {
        const data = { ...user, type: 'refresh' };
        return this.jwtService.sign(data, {
            secret: this.configService.get<string>(ENV_JWT_SECRET),
            expiresIn: 3600,
        });
    }

    // 토큰 추출
    extractToken(rawToken: string, isBasic: boolean) {
        const splitToken = rawToken.split(' ');
        const prefix = isBasic ? 'Basic' : 'Bearer';
        if (splitToken.length !== 2 && splitToken[0] !== prefix) {
            tokenException();
        }

        return splitToken[1];
    }

    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get<string>(ENV_JWT_SECRET),
            });
        } catch (error) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }
    }
}
