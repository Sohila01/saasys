import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class CommentsService {
  constructor(private supabaseService: SupabaseService) {}

  async getComments(recordId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('comments')
      .select('*')
      .eq('record_id', recordId)
      .order('created_at', { ascending: false });

    return data || [];
  }

  async createComment(recordId: string, content: string, userId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('comments')
      .insert([{ record_id: recordId, content, created_by: userId }])
      .select()
      .single();

    return data;
  }

  async deleteComment(commentId: string, token: string) {
    await this.supabaseService
      .getClientWithToken(token)
      .from('comments')
      .delete()
      .eq('id', commentId);

    return { message: 'Comment deleted' };
  }
}
