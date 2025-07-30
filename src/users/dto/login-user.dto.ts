import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from '../entity/user.entity';

export class LoginUserDto extends PickType(UsersModel, ['email', 'password']) {}
