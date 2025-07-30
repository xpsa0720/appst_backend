import { BadRequestException } from '@nestjs/common';

export const notFoundPostException = () => {
    return new BadRequestException(
        '정보와 일치하는 포스트가 존재하지 않습니다!',
    );
};
