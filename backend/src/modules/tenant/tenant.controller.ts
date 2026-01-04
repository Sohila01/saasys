import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto, InviteUserDto, UpdateUserRoleDto } from './dtos/tenant.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('tenants')
@Controller('tenants')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get(':tenantId')
  @ApiOperation({ summary: 'Get tenant details' })
  async getTenant(@Param('tenantId') tenantId: string) {
    return this.tenantService.getTenant(tenantId);
  }

  @Patch(':tenantId')
  @ApiOperation({ summary: 'Update tenant settings' })
  async updateTenant(
    @Param('tenantId') tenantId: string,
    @Body() updateDto: UpdateTenantDto,
  ) {
    return this.tenantService.updateTenant(tenantId, updateDto);
  }

  @Get(':tenantId/users')
  @ApiOperation({ summary: 'List users in tenant' })
  async getTenantUsers(@Param('tenantId') tenantId: string) {
    return this.tenantService.getTenantUsers(tenantId);
  }

  @Post(':tenantId/users')
  @ApiOperation({ summary: 'Invite user to tenant' })
  async inviteUser(
    @Param('tenantId') tenantId: string,
    @Body() inviteDto: InviteUserDto,
  ) {
    return this.tenantService.inviteUser(tenantId, inviteDto);
  }

  @Patch(':tenantId/users/:userId')
  @ApiOperation({ summary: 'Update user role' })
  async updateUserRole(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
    @Body() updateDto: UpdateUserRoleDto,
  ) {
    return this.tenantService.updateUserRole(tenantId, userId, updateDto);
  }

  @Delete(':tenantId/users/:userId')
  @ApiOperation({ summary: 'Delete user from tenant' })
  async deleteUser(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
  ) {
    return this.tenantService.deleteUser(tenantId, userId);
  }
}
