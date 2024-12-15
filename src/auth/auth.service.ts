import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as argon2 from 'argon2';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly JwtService: JwtService,
  ){}

  async login(user: User){
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    }

    const accessToken = this.JwtService.sign(payload)
    const refreshToken = this.JwtService.sign(payload, {
      expiresIn : process.env.REFRESH_EXPIRY
    })

    await this.userService.saveRefreshToken(user.email, refreshToken)

    return {
      accessToken, refreshToken
    }
  }

  async validateUser(email: string, password: string){
    console.log(email)
    const user = await this.userService.findOneByEmail(email)

    if (!user){
      throw new UnauthorizedException('user does not exist')
    }

    const isPasswordMatch = await argon2.verify(user.password, password)

    if (!isPasswordMatch){
      throw new UnauthorizedException('Email not registered')
    }

    return user
  }

  async refreshToken(user: User, refreshToken: string) {
    const userWithRefreshToken = await this.userService.findUserByRefreshToken(user.email, refreshToken)

    const payload = {
      sub: userWithRefreshToken.id,
      email: userWithRefreshToken.email,
      role: userWithRefreshToken.role
    }

    const accessToken = this.JwtService.sign(payload)

    return accessToken
  }

  async logout(email: string) {
    return this.userService.removeRefreshToken(email)
  }
}