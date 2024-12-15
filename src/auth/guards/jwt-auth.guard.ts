import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { AuthGuard } from '@nestjs/passport';
  import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
        ]);

        if (isPublic) {
        return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        console.log(token);

        if (!token) {
        throw new UnauthorizedException('Token missing');
        }

        try {
        const decoded = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('JWT_SECRET'),
        });
        request.user = decoded;
        console.log(decoded);
        return true;
        // return super.canActivate(context)
        } catch (error) {
        console.error('error here', error);
        throw new UnauthorizedException('Invalid or expired token');
        }
    }
}