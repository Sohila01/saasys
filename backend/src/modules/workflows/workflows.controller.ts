import { Controller, Get, Post, Patch, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('workflows')
@Controller('workflows')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkflowsController {
  constructor(private workflowsService: WorkflowsService) {}

  @Get()
  async getWorkflows(@CurrentUser() user: any) {
    return this.workflowsService.getWorkflows(user.tenantId, user.token);
  }

  @Post()
  async createWorkflow(@Body() workflowData: any, @CurrentUser() user: any) {
    return this.workflowsService.createWorkflow(user.tenantId, workflowData, user.token);
  }

  @Patch(':id')
  async updateWorkflow(@Param('id') workflowId: string, @Body() workflowData: any, @CurrentUser() user: any) {
    return this.workflowsService.updateWorkflow(workflowId, workflowData, user.token);
  }

  @Delete(':id')
  async deleteWorkflow(@Param('id') workflowId: string, @CurrentUser() user: any) {
    return this.workflowsService.deleteWorkflow(workflowId, user.token);
  }
}
