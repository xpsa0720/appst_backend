import {
    CallHandler,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly dataSource: DataSource) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const qr = this.dataSource.createQueryRunner();
        const req = context.switchToHttp().getRequest();

        await qr.connect();
        await qr.startTransaction();

        req.QueryRunner = qr;

        return next.handle().pipe(
            catchError(async (e) => {
                await qr.rollbackTransaction();
                await qr.release();
                throw new InternalServerErrorException(e.message);
            }),
            tap(async () => {
                await qr.commitTransaction();
                await qr.release();
            }),
        );
    }
}
