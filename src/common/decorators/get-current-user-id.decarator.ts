import { createParamDecorator, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { JwtPayload } from "../types";


export const GetCurrentUserUd = createParamDecorator((_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if(!user){
        throw new ForbiddenException("User not found❌")
    }

    console.log("user", user);
    

    return user.id;
})