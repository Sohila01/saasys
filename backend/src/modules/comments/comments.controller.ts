import { Controller, Get, Post, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':recordId')
  async getComments(@Param('recordId') recordId: string, @CurrentUser() user: any) {
    return this.commentsService.getComments(recordId, user.token);
  }

  @Post(':recordId')
  async createComment(
    @Param('recordId') recordId: string,
    @Body('content') content: string,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.createComment(recordId, content, user.userId, user.token);
  }

  @Delete(':id')
  async deleteComment(@Param('id') commentId: string, @CurrentUser() user: any) {
    return this.commentsService.deleteComment(commentId, user.token);
  }
}
