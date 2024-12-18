import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";
import { User } from "src/user/entities/user.entity";
// import { Passport } from "passport";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
    constructor(
        private authService: AuthService,
    ){
        super({
            usernameField: 'email',
        })
    }

    async validate(email: string, password: string):Promise<User> {
        console.log('local auth')
        const user = await this.authService.validateUser(email, password)

        if (!user){
            throw new UnauthorizedException("User not authorized")
        }

        return user
    }
}