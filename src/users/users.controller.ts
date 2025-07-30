import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesEnum } from './const/roles.const';
import { Roles } from 'src/auth/decorator/role.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // @Post('register')
    // postCreateUser(@Body() user: CreateUserDto) {
    //     return this.usersService.createUser(user);
    // }
    @Get()
    @Roles(RolesEnum.ADMIN)
    getAllUser() {
        return this.usersService.getAllUser();
    }
}
