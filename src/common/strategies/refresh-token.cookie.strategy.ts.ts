import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";
import { JwtPayload, JwtPayloadRefreshToken } from "../types";
import { Request } from "express";
import { ForbiddenException, Injectable } from "@nestjs/common";

export const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
    if(req && req.cookies){
        return req.cookies['refresh_token']
    }
    return null;
}

@Injectable()
export class RefreshTokenCookieStrategy extends PassportStrategy(Strategy, "refresh-jwt"){
    constructor(){
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.REFRESH_TOKEN_KEY,
            passReqToCallback: true,
        })
    };

    validate(req: Request, payload: JwtPayload): JwtPayloadRefreshToken{
        const refreshToken = req.cookies.refresh_token;
        if(!refreshToken){
            throw new ForbiddenException("Resresh token notug'ri❌")
        }
        return {...payload, refreshToken};
    };
}