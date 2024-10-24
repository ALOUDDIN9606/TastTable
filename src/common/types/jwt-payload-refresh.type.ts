import { JwtPayload } from "./jwt.payload.type";


export type JwtPayloadRefreshToken = JwtPayload & { refreshToken: string };