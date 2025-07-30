import { BadRequestException } from "@nestjs/common"

export const tokenException = () => {return new BadRequestException("토큰이 올바르지 않습니다!") }