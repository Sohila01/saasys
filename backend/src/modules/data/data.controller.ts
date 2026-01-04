import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { DataService } from './data.service';
import { CreateRecordDto, UpdateRecordDto, QueryRecordsDto } from './dtos/data.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('data')
@Controller('data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DataController {
  constructor(private dataService: DataService) {}

  @Get(':moduleSlug')
  @ApiOperation({ summary: 'List records for module' })
  async getRecords(
    @Param('moduleSlug') moduleSlug: string,
    @Query() query: QueryRecordsDto,
    @CurrentUser() user: any,
  ) {
    const token = user.token;
    return this.dataService.getRecords(moduleSlug, user.tenantId, query, token);
  }

  @Post(':moduleSlug')
  @ApiOperation({ summary: 'Create new record' })
  async createRecord(
    @Param('moduleSlug') moduleSlug: string,
    @Body() createDto: CreateRecordDto,
    @CurrentUser() user: any,
  ) {
    const token = user.token;
    return this.dataService.createRecord(moduleSlug, user.tenantId, createDto, token, user.userId);
  }

  @Get(':moduleSlug/:recordId')
  @ApiOperation({ summary: 'Get record details' })
  async getRecord(
    @Param('moduleSlug') moduleSlug: string,
    @Param('recordId') recordId: string,
    @CurrentUser() user: any,
  ) {
    const token = user.token;
    return this.dataService.getRecord(moduleSlug, recordId, user.tenantId, token);
  }

  @Patch(':moduleSlug/:recordId')
  @ApiOperation({ summary: 'Update record' })
  async updateRecord(
    @Param('moduleSlug') moduleSlug: string,
    @Param('recordId') recordId: string,
    @Body() updateDto: UpdateRecordDto,
    @CurrentUser() user: any,
  ) {
    const token = user.token;
    return this.dataService.updateRecord(moduleSlug, recordId, user.tenantId, updateDto, token);
  }

  @Delete(':moduleSlug/:recordId')
  @ApiOperation({ summary: 'Delete record' })
  async deleteRecord(
    @Param('moduleSlug') moduleSlug: string,
    @Param('recordId') recordId: string,
    @CurrentUser() user: any,
  ) {
    const token = user.token;
    return this.dataService.deleteRecord(moduleSlug, recordId, user.tenantId, token);
  }
}
