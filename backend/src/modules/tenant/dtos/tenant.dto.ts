import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum SubscriptionTier {
  STARTER = 'starter',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(SubscriptionTier)
  subscription_tier?: SubscriptionTier;
}

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(SubscriptionTier)
  subscription_tier?: SubscriptionTier;
}

export class InviteUserDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class UpdateUserRoleDto {
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  status?: string;
}
