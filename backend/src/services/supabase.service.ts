import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabaseAdmin: SupabaseClient;
  private supabaseClient: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

    // Admin client for server-side operations (bypasses RLS)
    this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Regular client (respects RLS)
    this.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Get admin client (server-side, bypasses RLS)
   */
  getAdmin(): SupabaseClient {
    return this.supabaseAdmin;
  }

  /**
   * Get regular client (respects RLS)
   */
  getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * Get client with custom bearer token (for user requests)
   */
  getClientWithToken(token: string): SupabaseClient {
    return createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    );
  }

  /**
   * Execute query with RLS enforced (user context)
   */
  async query<T>(
    query: (client: SupabaseClient) => Promise<any>,
    token?: string,
  ): Promise<T> {
    const client = token ? this.getClientWithToken(token) : this.supabaseClient;
    const result = await query(client);

    if (result.error) {
      throw new Error(`Database error: ${result.error.message}`);
    }

    return result.data as T;
  }

  /**
   * Execute admin query (bypasses RLS)
   */
  async adminQuery<T>(
    query: (client: SupabaseClient) => Promise<any>,
  ): Promise<T> {
    const result = await query(this.supabaseAdmin);

    if (result.error) {
      throw new Error(`Database error: ${result.error.message}`);
    }

    return result.data as T;
  }
}
