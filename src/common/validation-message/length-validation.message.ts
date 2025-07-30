import { ValidationArguments } from 'class-validator';

export const lengthVlidationMessage = (args: ValidationArguments) => {
    if (args.constraints.length == 2) {
        return `${args.property}가(이) 길이가 최소 ${args.constraints[0]}글자에서 최대 ${args.constraints[1]}글자여야 합니다!`;
    } else {
        return `${args.property}가(이) 길이가 최소 ${args.constraints[0]}여야 합니다!`;
    }
};
