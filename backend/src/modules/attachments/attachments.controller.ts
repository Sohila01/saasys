import { Controller, Get, Delete, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AttachmentsService } from './attachments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('attachments')
@Controller('attachments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttachmentsController {
  constructor(private attachmentsService: AttachmentsService) {}

  @Get(':recordId')
  async getAttachments(@Param('recordId') recordId: string, @CurrentUser() user: any) {
    return this.attachmentsService.getAttachments(recordId, user.token);
  }

  @Delete(':id')
  async deleteAttachment(@Param('id') attachmentId: string, @CurrentUser() user: any) {
    return this.attachmentsService.deleteAttachment(attachmentId, user.token);
  }
}
