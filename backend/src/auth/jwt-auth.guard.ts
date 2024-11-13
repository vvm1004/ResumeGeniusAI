import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        // Nếu API là public, thì vẫn cho phép đi vào guard
        if (isPublic) {
            return super.canActivate(context);
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            // Nếu là public API và không có user, vẫn cho phép request đi tiếp mà không cần user
            if (err || !user) {
                return null;
            }
        } else {
            // Nếu không phải là public API và không có user, thì ném ra lỗi
            if (err || !user) {
                throw err || new UnauthorizedException("Token không hợp lệ hoặc hết hạn!!");
            }
        }


        const isSkipPermission = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_PERMISSION, [
            context.getHandler(),
            context.getClass(),
        ]);
          //check permissions
          const targetMethod = request.method;
          const targetEndpoint = request.route?.path as string;
          const permissions = user?.permissions ?? [];
          let isExist = permissions.find(permission =>
              targetMethod === permission.method &&
              targetEndpoint === permission.apiPath
          );
          if (targetEndpoint.startsWith("/api/v1/auth")) isExist = true;
          if (!isExist && !isSkipPermission) {
              throw new ForbiddenException("Bạn không có quyền truy cập endpoint này")
          }
          return user;
    }
}
