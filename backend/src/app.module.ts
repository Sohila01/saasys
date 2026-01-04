import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { ConfigModule as SchemaConfigModule } from './modules/config/config.module';
import { DataModule } from './modules/data/data.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { CommentsModule } from './modules/comments/comments.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { HealthController } from './common/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AuthModule,
    TenantModule,
    SchemaConfigModule,
    DataModule,
    DashboardModule,
    NotificationsModule,
    AttachmentsModule,
    CommentsModule,
    SuppliersModule,
    WorkflowsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
