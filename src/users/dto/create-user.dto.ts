import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from '../entity/user.entity';

export class CreateUserDto extends PickType(UsersModel, [
    'nickname',
    'email',
    'password',
]) {}
