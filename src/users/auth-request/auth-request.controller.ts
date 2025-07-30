import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { AuthRequestService } from './auth-request.service';
import { User } from 'src/auth/decorator/user.decorator';
import { AuthRequestDto } from './dto/auth-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryRunner, Transaction } from 'typeorm';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { GetQueryRunner } from 'src/common/decorator/get-queryrunner.decorator';

@Controller('auth-request')
export class AuthRequestController {
    constructor(private readonly authRequestService: AuthRequestService) {}

    @Get('request')
    getAuthResponse(@User() user) {
        return this.authRequestService.getAuthResponse(user);
    }

    @Get('response')
    getAuthRequest(@User() user) {
        return this.authRequestService.getAuthResponse(user);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(TransactionInterceptor)
    postAuthRequest(
        @User() user,
        @Body() dto: AuthRequestDto,
        @UploadedFile() image: Express.Multer.File,
        @GetQueryRunner() qr: QueryRunner,
    ) {
        return this.authRequestService.authRequest(user, dto, image, qr);
    }

    @Post(':AuthRequestId')
    @UseInterceptors(TransactionInterceptor)
    postConfirm(
        @User() user,
        @Param('AuthRequestId', ParseIntPipe) AuthRequestId: number,
        @GetQueryRunner() qr: QueryRunner,
    ) {
        return this.authRequestService.AuthConfirm(user, AuthRequestId, qr);
    }
}
