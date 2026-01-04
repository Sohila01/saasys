import { IsObject, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class CreateRecordDto {
  @IsObject()
  data: Record<string, any>;
}

export class UpdateRecordDto {
  @IsObject()
  data: Record<string, any>;
}

export class QueryRecordsDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}
