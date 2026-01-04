import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Refresh token is required' })
  refresh_token: string;
}

export class AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    tenant_id: string;
    role: string;
  };
}

export class CurrentUserDto {
  userId: string;
  email: string;
  tenantId: string;
  role: string;
}
