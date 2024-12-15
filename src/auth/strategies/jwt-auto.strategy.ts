import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from 'passport-jwt'
import { UserService } from "src/user/user.service";
import { Payload } from "../types/payload.type";



@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ){
        super({
            jwtFormRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreEcpiration: false,
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate(payload: Payload) {
        console.log(payload)
        const user = await this.userService.findOneById(payload.sub)
        if (!user) {
            throw new UnauthorizedException('Invalid or expired token');
          }
        return user
    }
}