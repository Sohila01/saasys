import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class NotificationsService {
  constructor(private supabaseService: SupabaseService) {}

  async getNotifications(userId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return data || [];
  }

  async markAsRead(notificationId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    return data;
  }
}
