import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';
import { CreateTenantDto, UpdateTenantDto, InviteUserDto, UpdateUserRoleDto } from './dtos/tenant.dto';

@Injectable()
export class TenantService {
  constructor(private supabaseService: SupabaseService) {}

  async getTenant(tenantId: string) {
    const { data, error } = await this.supabaseService
      .getAdmin()
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Tenant not found');
    }

    return data;
  }

  async updateTenant(tenantId: string, updateDto: UpdateTenantDto) {
    const { data, error } = await this.supabaseService
      .getAdmin()
      .from('tenants')
      .update(updateDto)
      .eq('id', tenantId)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to update tenant');
    }

    return data;
  }

  async getTenantUsers(tenantId: string) {
    const { data, error } = await this.supabaseService
      .getAdmin()
      .from('users')
      .select('id, email, full_name, role, status, created_at')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException('Failed to fetch users');
    }

    return data || [];
  }

  async inviteUser(tenantId: string, inviteDto: InviteUserDto) {
    // Check if user already exists
    const { data: existingUser } = await this.supabaseService
      .getAdmin()
      .from('users')
      .select('id')
      .eq('email', inviteDto.email)
      .eq('tenant_id', tenantId)
      .single();

    if (existingUser) {
      throw new BadRequestException('User already exists in tenant');
    }

    // Insert new user
    const { data, error } = await this.supabaseService
      .getAdmin()
      .from('users')
      .insert([
        {
          email: inviteDto.email,
          full_name: inviteDto.email.split('@')[0],
          tenant_id: tenantId,
          role: inviteDto.role || 'viewer',
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to invite user');
    }

    // TODO: Send invitation email

    return { message: 'User invited successfully', user: data };
  }

  async updateUserRole(tenantId: string, userId: string, updateDto: UpdateUserRoleDto) {
    const { data, error } = await this.supabaseService
      .getAdmin()
      .from('users')
      .update({
        role: updateDto.role,
        status: updateDto.status,
      })
      .eq('id', userId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to update user role');
    }

    return data;
  }

  async deleteUser(tenantId: string, userId: string) {
    const { error } = await this.supabaseService
      .getAdmin()
      .from('users')
      .update({ status: 'inactive' })
      .eq('id', userId)
      .eq('tenant_id', tenantId);

    if (error) {
      throw new BadRequestException('Failed to delete user');
    }

    return { message: 'User deleted successfully' };
  }
}
