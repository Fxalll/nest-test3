// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { logger } from './middleware/logger/logger.middleware';
import { TransformInterceptor } from './interceptor/transform/transform.interceptor';
import { HttpExceptionFilter } from './filter/http-exception/http-exception.filter';
import { AllExceptionsFilter } from './filter/any-exception/any-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  // 监听所有的请求路由，并打印日志
  app.use(logger);
  // 使用全局拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api/');
  // 过滤处理 HTTP 异常
  app.useGlobalFilters(new AllExceptionsFilter()); // 注意：AllExceptionsFilter 要在 HttpExceptionFilter 的上面，否则 HttpExceptionFilter 就不生效了，全被 AllExceptionsFilter 捕获了。
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置 Swagger
  const options = new DocumentBuilder()
    .setTitle('Nest-test3')
    .setDescription('The Nest-test3 API description')
    .setVersion('1.0')
    .addTag('test')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(3000);
}
bootstrap();
