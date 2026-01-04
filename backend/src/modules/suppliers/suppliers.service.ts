import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class SuppliersService {
  constructor(private supabaseService: SupabaseService) {}

  async getSuppliers(tenantId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('suppliers')
      .select('*')
      .eq('tenant_id', tenantId);

    return data || [];
  }

  async createSupplier(tenantId: string, supplierData: any, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('suppliers')
      .insert([{ ...supplierData, tenant_id: tenantId }])
      .select()
      .single();

    return data;
  }

  async updateSupplier(supplierId: string, supplierData: any, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('suppliers')
      .update(supplierData)
      .eq('id', supplierId)
      .select()
      .single();

    return data;
  }

  async deleteSupplier(supplierId: string, token: string) {
    await this.supabaseService
      .getClientWithToken(token)
      .from('suppliers')
      .delete()
      .eq('id', supplierId);

    return { message: 'Supplier deleted' };
  }
}
