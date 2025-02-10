import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Permissions } from './permissions.decorator'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get(Permissions, context.getHandler())
    if (!permissions) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    // Se o usuário é interno, não precisa verificar permissões
    if (request.user.role.startsWith('INTERNAL')) {
      return true
    }

    const hasPermission = permissions.some((permission) =>
      request.user?.permissions.includes(permission),
    )

    if (!hasPermission) {
      return false
    }

    return true
  }
}
