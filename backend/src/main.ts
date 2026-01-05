import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  
  // CORS Configuration - Allow all origins for now, refine later
  app.use(cors({
    origin: true, // Allow all origins during development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Nexus SaaS Platform API')
    .setDescription('Production-ready Multi-tenant SaaS API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Middleware to attach token to request
  app.use((req: any, res: any, next: any) => {
    if (req.user) {
      req.user.token = req.headers.authorization?.split(' ')[1];
    }
    next();
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
  console.log(`📚 Swagger docs available at http://0.0.0.0:${port}/api/docs`);
}

bootstrap().catch(err => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});
