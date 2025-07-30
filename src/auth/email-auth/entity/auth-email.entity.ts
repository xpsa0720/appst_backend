import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/baseModel.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class AuthEmailModel extends BaseModel {
    @IsString()
    @Column()
    email: string;
}
