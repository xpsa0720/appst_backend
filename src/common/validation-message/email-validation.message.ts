import { ValidationArguments } from 'class-validator';

export const emailVlidationMessage = (args: ValidationArguments) => {
    return `${args.property}가 이메일 형태가 아닙니다!`;
};
