import { SetMetadata } from '@nestjs/common';

export const REFRESH_TOKEN_ROUTE_KEY = 'refresh_token_route';

export const RfreshTokenRoute = () =>
    SetMetadata(REFRESH_TOKEN_ROUTE_KEY, true);
