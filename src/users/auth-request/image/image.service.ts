import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthRequestImageModel } from "../entity/auth-request-image.entity";

@Injectable()
export class AuthImageService {
    constructor(
        @InjectRepository(AuthRequestImageModel)
        private readonly authRequestImageModelRepository: Repository<AuthRequestImageModel>,
    ) { }
    
}