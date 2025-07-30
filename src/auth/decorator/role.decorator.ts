import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/users/const/roles.const';

export const ROLE_KEY = 'role';

export const Roles = (ADMIN: RolesEnum) => SetMetadata(ROLE_KEY, RolesEnum.ADMIN);
