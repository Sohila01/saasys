import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('config')
@Controller('config')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get('modules')
  @ApiOperation({ summary: 'Get all modules for tenant' })
  async getModules(@CurrentUser() user: any) {
    return this.configService.getModules(user.tenantId, user.token);
  }

  @Get('modules/:moduleId/fields')
  @ApiOperation({ summary: 'Get module fields' })
  async getModuleFields(@Param('moduleId') moduleId: string, @CurrentUser() user: any) {
    return this.configService.getModuleFields(moduleId, user.token);
  }

  @Post('modules')
  @ApiOperation({ summary: 'Create a new sub-module' })
  @ApiResponse({ status: 201, description: 'Sub-module created successfully' })
  async createSubModule(@Body() payload: any, @CurrentUser() user: any) {
    return this.configService.createSubModule(user.tenantId, user.token, payload);
  }
}
