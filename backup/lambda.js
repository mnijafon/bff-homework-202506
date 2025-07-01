"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { NestFactory } from '@nestjs/core';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';
// import type { Callback, Context } from 'aws-lambda';
// import { APIGatewayProxyEvent } from 'aws-lambda';
// import { AppModule } from './app.module';
// import awsLambdaFastify from '@fastify/aws-lambda';
// import type { FastifyInstance } from 'fastify';
// import multipart from '@fastify/multipart';
// import {
//   HttpStatus,
//   UnprocessableEntityException,
//   ValidationPipe,
// } from '@nestjs/common';
// import { useContainer } from 'class-validator';
// import { DataSource } from 'typeorm';
//
// let cachedServer: any;
// let cachedApp: NestFastifyApplication;
// let connectionReadyPromise: Promise<void> | null = null;
//
// // 初始化数据库连接
// async function initializeConnection() {
//   if (!connectionReadyPromise) {
//     connectionReadyPromise = (async () => {
//       try {
//         const dataSource = cachedApp.get(DataSource);
//         if (!dataSource.isInitialized) {
//           await dataSource.initialize();
//         }
//       } catch (error) {
//         console.error('Database connection error:', error);
//         connectionReadyPromise = null;
//         throw error;
//       }
//     })();
//   }
//   return connectionReadyPromise;
// }
//
// async function bootstrap() {
//   if (!cachedServer) {
//     const app = await NestFactory.create<NestFastifyApplication>(
//       AppModule,
//       new FastifyAdapter({
//         logger: true,
//         // Fastify 性能优化
//         disableRequestLogging: true,
//         ignoreTrailingSlash: true,
//         connectionTimeout: 10000,
//       }),
//     );
//
//     cachedApp = app;
//
//     useContainer(app.select(AppModule), { fallbackOnErrors: true });
//
//     app.useGlobalPipes(
//       new ValidationPipe({
//         transform: true,
//         whitelist: true,
//         transformOptions: { enableImplicitConversion: true },
//         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
//         stopAtFirstError: true,
//         exceptionFactory: (errors) =>
//           new UnprocessableEntityException(
//             errors.map((e) => {
//               const rule = Object.keys(e.constraints!)[0];
//               return e.constraints![rule];
//             })[0],
//           ),
//       }),
//     );
//
//     app.enableCors({
//       origin: '*',
//       methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//       allowedHeaders:
//         'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
//       preflightContinue: false,
//       optionsSuccessStatus: 204,
//     });
//
//     app.register(multipart as any, {
//       limits: {
//         fieldNameSize: 100,
//         fieldSize: 100,
//         fields: 10,
//         fileSize: 5 * 1024 * 1024,
//         files: 1,
//         headerPairs: 2000,
//         parts: 1000,
//       },
//     });
//
//     await app.init();
//     const instance = app.getHttpAdapter().getInstance();
//     cachedServer = awsLambdaFastify(instance as unknown as FastifyInstance);
//   }
//
//   // 确保数据库连接已初始化
//   await initializeConnection();
//
//   return cachedServer;
// }
//
// export const handler = async (
//   event: APIGatewayProxyEvent,
//   context: Context,
//   callback: Callback,
// ) => {
//   // 重要：防止等待事件循环
//   context.callbackWaitsForEmptyEventLoop = false;
//
//   try {
//     const server = await bootstrap();
//     return await server(event, context, callback);
//   } catch (error) {
//     console.error('Lambda handler error:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal Server Error' }),
//     };
//   }
// };
//
// export default handler;
