import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options: SwaggerDocumentOptions =  {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };
  
  const config = new DocumentBuilder()
    .setTitle('Video Streaming Service')
    .setDescription('This is the API for streamin video files')
    .setVersion('1.0')
    .addTag('videos')
    .build();

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  
  app.enableCors()

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(3000);
}
bootstrap();
