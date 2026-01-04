import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  async getModules(@CurrentUser() user: any) {
    return this.configService.getModules(user.tenantId, user.token);
  }

  @Get('modules/:moduleId/fields')
  async getModuleFields(@Param('moduleId') moduleId: string, @CurrentUser() user: any) {
    return this.configService.getModuleFields(moduleId, user.token);
  }
}
