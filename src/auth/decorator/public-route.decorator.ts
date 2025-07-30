import { SetMetadata } from "@nestjs/common";

export const publicRouteKey = 'publicRoute'

export const PublicRoute = () => SetMetadata(publicRouteKey, true);