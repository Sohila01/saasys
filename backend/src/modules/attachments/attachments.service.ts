import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class AttachmentsService {
  constructor(private supabaseService: SupabaseService) {}

  async getAttachments(recordId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('attachments')
      .select('*')
      .eq('record_id', recordId);

    return data || [];
  }

  async deleteAttachment(attachmentId: string, token: string) {
    await this.supabaseService
      .getClientWithToken(token)
      .from('attachments')
      .delete()
      .eq('id', attachmentId);

    return { message: 'Attachment deleted' };
  }
}
