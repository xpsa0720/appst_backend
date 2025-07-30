import { BadRequestException } from "@nestjs/common"

export const notFoundUserException = () => {return new BadRequestException("정보와 일치하는 유저가 존재하지 않습니다!") }