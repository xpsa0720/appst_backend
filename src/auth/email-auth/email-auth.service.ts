import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    ENV_EMAIL,
    ENV_EMAIL_PASSWORD_KEY,
    ENV_SMTP_EMAIL_KEY,
    ENV_SMTP_PORT_KEY,
    ENV_SMTP_SERVER_KEY,
} from 'src/common/const/env.keys.const';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import SMTPPool from 'nodemailer/lib/smtp-pool';
import Mail from 'nodemailer/lib/mailer';
import { time } from 'console';
import { title } from 'process';
import { AuthEmailDto } from './dto/auth-email.dto';
import { AuthEmailModel } from './entity/auth-email.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entity/user.entity';

@Injectable()
export class EmailAuthService {
    private transporter;
    private blockList: Map<string, boolean>;
    private emailAuthList: Map<string, string>;
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(AuthEmailModel)
        private readonly authEmailRepository: Repository<AuthEmailModel>,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
    ) {
        const password = this.configService.get<string>(
            ENV_EMAIL_PASSWORD_KEY,
        )!;
        const email = this.configService.get<string>(ENV_SMTP_EMAIL_KEY)!;
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                user: email,
                pass: password,
            },
        });
        this.blockList = new Map<string, boolean>();
        this.emailAuthList = new Map<string, string>();
    }

    generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendVerificationToEmail(email: string, ip: string) {
        console.log(this.blockList[email + ':' + ip]);
        if (this.blockList.get(email + ':' + ip)) {
            throw new BadRequestException(
                '인증 이메일은 10초에 한번씬 발송 가능합니다.',
            );
        }

        const exisitEmail = await this.usersRepository.exists({
            where: { email },
        });

        if (exisitEmail) {
            throw new BadRequestException('이미 가입되어 있는 이메일 입니다.');
        }

        const authCode = this.generateVerificationCode();
        this.blockList.set(email + ':' + ip, true);
        this.emailAuthList.set(email + ':' + ip, authCode);

        setTimeout(() => {
            this.blockList.delete(email + ':' + ip);
        }, 10000);

        setTimeout(async () => {
            this.emailAuthList.delete(email + ':' + ip);
        }, 60000 * 5);
        // ,

        await this.transporter.sendMail({
            to: email,
            text: `인증번호: ${authCode}`,
            subject: `appst 인증번호`,
        });
    }

    async VerificationToEmail(dto: AuthEmailDto, ip: string) {
        const temp_authCode = this.emailAuthList.get(dto.email + ':' + ip);
        if (temp_authCode === undefined && temp_authCode !== dto.auth_code) {
            throw new BadRequestException('인증번호가 잘못되었습니다!');
        }
        this.emailAuthList.delete(dto.email + ':' + ip);

        this.authEmailRepository.save({ email: dto.email });
        setTimeout(async () => {
            await this.authEmailRepository.delete({
                email: dto.email,
            });
        }, 60000 * 10);

        return true;
    }
}
