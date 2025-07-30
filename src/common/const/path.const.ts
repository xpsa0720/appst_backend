import { join } from 'path';

//루트
export const PROJECT_ROOT_PATH = process.cwd();
//공개 폴더 이름
export const PUBLIC_FOLDER_NAME = 'public';

//공개 폴더 경로
export const PROJECT_PUBLIC_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

//인증 사진 경로
export const PUBLIC_AUTH_IMAGE_FOLDER_NAME = 'auth';
export const PUBLIC_AUTH_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    PUBLIC_AUTH_IMAGE_FOLDER_NAME,
);
