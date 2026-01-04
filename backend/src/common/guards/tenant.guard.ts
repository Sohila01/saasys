import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verify tenant_id is present
    if (!user || !user.tenantId) {
      throw new ForbiddenException('Tenant ID not found in token');
    }

    // Verify tenant_id in URL matches token
    const urlTenantId = request.params.tenantId;
    if (urlTenantId && urlTenantId !== user.tenantId) {
      throw new ForbiddenException('Access denied: tenant mismatch');
    }

    return true;
  }
}
