import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailAuthService } from './email-auth.service';
import { GetIp } from 'src/common/decorator/get-ip.decorator';
import { PublicRoute } from '../decorator/public-route.decorator';
import { AuthEmailDto } from './dto/auth-email.dto';

@Controller('email-auth')
export class EmailAuthController {
    constructor(private readonly emailAuthService: EmailAuthService) {}
    @Post('send')
    @PublicRoute()
    postsendEmail(@Body('email') email: string, @GetIp() Ip: string) {
        return this.emailAuthService.sendVerificationToEmail(email, Ip);
    }

    @Post('auth')
    @PublicRoute()
    postAuthEmail(@Body() dto: AuthEmailDto, @GetIp() Ip: string) {
        return this.emailAuthService.VerificationToEmail(dto, Ip);
    }
}
