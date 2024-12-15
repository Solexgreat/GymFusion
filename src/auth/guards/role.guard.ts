import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/enums/role.enum";
import { ROLE_KEY } from "../decorators/role.decorator";

@Injectable()
export class RolesGurd implements CanActivate{
    constructor(
        private reeflector: Reflector,
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRole = this.reeflector.getAllAndOverride<Role[]>(ROLE_KEY,[
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRole) {
            return true
        }
        const {user} = context.switchToHttp().getRequest()
        return requiredRole.includes(user.role)
    }
}