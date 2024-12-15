import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtGuard } from './guards/refresh.token.guard';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login (@Req() req) {
    const user = req.user
    console.log(user)
    return await this.authService.login(user)
  }


  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  async refreshToken(@Req() req: any) {
    const user = req.user;
    const refreshToken = req.headers['x-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    return {
      accessToken: await this.authService.refreshToken(user, refreshToken),
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const user = req.user;
    return this.authService.logout(user.email);
  }
}