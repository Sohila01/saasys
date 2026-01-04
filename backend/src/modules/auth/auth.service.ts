import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../services/supabase.service';
import { LoginDto, RefreshTokenDto, AuthResponseDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    try {
      // Authenticate with Supabase
      const { data, error } = await this.supabaseService
        .getAdmin()
        .auth.signInWithPassword({
          email,
          password,
        });

      if (error || !data?.user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Get user details from database
      const { data: userData, error: userError } = await this.supabaseService
        .getAdmin()
        .from('users')
        .select('id, email, full_name, tenant_id, role')
        .eq('id', data.user.id)
        .single();

      if (userError || !userData) {
        throw new UnauthorizedException('User not found');
      }

      // Generate JWT with custom claims
      const accessToken = this.jwtService.sign(
        {
          sub: userData.id,
          email: userData.email,
          tenant_id: userData.tenant_id,
          role: userData.role,
        },
        { expiresIn: this.configService.get('JWT_EXPIRATION') || '1h' },
      );

      const refreshToken = data.session?.refresh_token || '';

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          tenant_id: userData.tenant_id,
          role: userData.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed. Please try again.');
    }
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    const { refresh_token } = refreshTokenDto;

    try {
      // Refresh session with Supabase
      const { data, error } = await this.supabaseService
        .getAdmin()
        .auth.refreshSession({ refresh_token });

      if (error || !data?.user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get updated user details
      const { data: userData, error: userError } = await this.supabaseService
        .getAdmin()
        .from('users')
        .select('id, email, full_name, tenant_id, role')
        .eq('id', data.user.id)
        .single();

      if (userError || !userData) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new JWT
      const accessToken = this.jwtService.sign(
        {
          sub: userData.id,
          email: userData.email,
          tenant_id: userData.tenant_id,
          role: userData.role,
        },
        { expiresIn: this.configService.get('JWT_EXPIRATION') || '1h' },
      );

      const newRefreshToken = data.session?.refresh_token || refresh_token;

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
        user: {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          tenant_id: userData.tenant_id,
          role: userData.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    try {
      // Revoke session in Supabase
      await this.supabaseService.getClientWithToken(token).auth.signOut();
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new BadRequestException('Logout failed');
    }
  }

  async getCurrentUser(userId: string) {
    const { data, error } = await this.supabaseService
      .getAdmin()
      .from('users')
      .select('id, email, full_name, tenant_id, role, created_at')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new UnauthorizedException('User not found');
    }

    return data;
  }
}
