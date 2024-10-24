import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types";
import { Request } from "express";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccesstokenStrategy extends PassportStrategy(Strategy, "access-jwt"){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_KEY,
            passReqToCallback: true,
        })
    };

    validate(req: Request, payload: JwtPayload): JwtPayload{
        console.log('request', req);
        console.log('payload', payload);
        return payload;
    };
}