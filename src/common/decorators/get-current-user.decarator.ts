import { createParamDecorator, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { JwtPayload, JwtPayloadRefreshToken } from "../types";


export const GetCurrentUser = createParamDecorator((data: keyof JwtPayloadRefreshToken, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    console.log('data', data);

    if(!user){
        throw new ForbiddenException("Token notug'ri.")
    }
    if(!data) {
        return user
    }

    return user[data];
})