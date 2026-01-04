import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';
import { CreateRecordDto, UpdateRecordDto, QueryRecordsDto } from './dtos/data.dto';

@Injectable()
export class DataService {
  constructor(private supabaseService: SupabaseService) {}

  async getRecords(moduleSlug: string, tenantId: string, query: QueryRecordsDto, token: string) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;
    const sort = query.sort || 'created_at';
    const order = query.order || 'desc';

    try {
      // Get module details
      const { data: moduleData } = await this.supabaseService
        .getClientWithToken(token)
        .from('sub_modules')
        .select('id')
        .eq('slug', moduleSlug)
        .eq('tenant_id', tenantId)
        .single();

      if (!moduleData) {
        throw new NotFoundException('Module not found');
      }

      // Build query
      let dbQuery = this.supabaseService
        .getClientWithToken(token)
        .from('sub_module_records')
        .select('*', { count: 'exact' })
        .eq('module_id', moduleData.id)
        .order(sort, { ascending: order === 'asc' })
        .range(offset, offset + limit - 1);

      // Execute query
      const { data, count, error } = await dbQuery;

      if (error) {
        throw new BadRequestException('Failed to fetch records');
      }

      return {
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit),
        data: data || [],
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve records');
    }
  }

  async getRecord(moduleSlug: string, recordId: string, tenantId: string, token: string) {
    try {
      // Get module details
      const { data: moduleData } = await this.supabaseService
        .getClientWithToken(token)
        .from('sub_modules')
        .select('id')
        .eq('slug', moduleSlug)
        .eq('tenant_id', tenantId)
        .single();

      if (!moduleData) {
        throw new NotFoundException('Module not found');
      }

      // Get record
      const { data, error } = await this.supabaseService
        .getClientWithToken(token)
        .from('sub_module_records')
        .select('*')
        .eq('id', recordId)
        .eq('module_id', moduleData.id)
        .single();

      if (error || !data) {
        throw new NotFoundException('Record not found');
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve record');
    }
  }

  async createRecord(moduleSlug: string, tenantId: string, createDto: CreateRecordDto, token: string, userId: string) {
    try {
      // Get module details
      const { data: moduleData } = await this.supabaseService
        .getClientWithToken(token)
        .from('sub_modules')
        .select('id')
        .eq('slug', moduleSlug)
        .eq('tenant_id', tenantId)
        .single();

      if (!moduleData) {
        throw new NotFoundException('Module not found');
      }

      // Create record
      const { data, error } = await this.supabaseService
        .getClientWithToken(token)
        .from('sub_module_records')
        .insert([
          {
            module_id: moduleData.id,
            data: createDto.data,
            created_by: userId,
          },
        ])
        .select()
        .single();

      if (error || !data) {
        throw new BadRequestException('Failed to create record');
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create record');
    }
  }

  async updateRecord(moduleSlug: string, recordId: string, tenantId: string, updateDto: UpdateRecordDto, token: string) {
    try {
      // Get module details
      const { data: moduleData } = await this.supabaseService
        .getClientWithToken(token)
        .from('sub_modules')
        .select('id')
        .eq('slug', moduleSlug)
        .eq('tenant_id', tenantId)
        .single();

      if (!moduleData) {
        throw new NotFoundException('Module not found');
      }

      // Update record
      const { data, error } = await this.supabaseService
        .getClientWithToken(token)
        .from('sub_module_records')
        .update({ data: updateDto.data })
        .eq('id', recordId)
        .eq('module_id', moduleData.id)
        .select()
        .single();

      if (error || !data) {
        throw new BadRequestException('Failed to update record');
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update record');
    }
  }

  async deleteRecord(moduleSlug: string, recordId: string, tenantId: string, token: string) {
    try {
      // Get module details
      const { data: moduleData } = await this.supabaseService
        .getClientWithToken(token)
        .from('sub_modules')
        .select('id')
        .eq('slug', moduleSlug)
        .eq('tenant_id', tenantId)
        .single();

      if (!moduleData) {
        throw new NotFoundException('Module not found');
      }

      // Soft delete record
      const { error } = await this.supabaseService
        .getClientWithToken(token)
        .from('sub_module_records')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', recordId)
        .eq('module_id', moduleData.id);

      if (error) {
        throw new BadRequestException('Failed to delete record');
      }

      return { message: 'Record deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete record');
    }
  }
}
