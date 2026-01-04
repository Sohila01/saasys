import { Controller, Get, Patch, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@CurrentUser() user: any) {
    return this.notificationsService.getNotifications(user.userId, user.token);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(notificationId, user.token);
  }
}
