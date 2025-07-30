import { BadRequestException } from '@nestjs/common';

export const permissionException = () => {
    return new BadRequestException('권한이 부족합니다!');
};
