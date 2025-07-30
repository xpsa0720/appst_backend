import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersModel } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
    ENV_HASH_ROUNDS_KEY,
    ENV_JWT_SECRET,
} from 'src/common/const/env.keys.const';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly userRepository: Repository<UsersModel>,
        private readonly configService: ConfigService,
    ) {}

    getAllUser() {
        return this.userRepository.find();
    }

    async findUserWithEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }
}
