import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Determine allowed origins dynamically
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://tal-manage.netlify.app', 'https://skill-challenge-ui-r7bc.vercel.app'] // Production frontend
    : ['http://localhost:3000']; // Local development frontend

  // Set up CORS
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  // Set up Swagger API documentation for all environments
  const serverUrl = process.env.NODE_ENV === 'production'
    ? `https://skills-challenge.onrender.com/`
    : `http://localhost:${process.env.PORT || 10000}/`;

  const options = new DocumentBuilder()
    .setTitle('Umurava Skills Challenge API Documentation')
    .setDescription('Made by CyberMarineTeam')
    .setVersion('1.0')
    .addServer(serverUrl, process.env.NODE_ENV === 'production' ? 'Production' : 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Get the port from environment variables
  const port = process.env.PORT || 10000;
  console.log(`🚀 Server running on ${serverUrl}api`);

  // Start the server
  await app.listen(port, '0.0.0.0');
}

bootstrap();
