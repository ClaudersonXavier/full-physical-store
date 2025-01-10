import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Physical Store')  
    .setDescription('A documentação da API requesitada pelos supervisores sendo o desafio 3 do programa de bolsa da Compass sobre a criação de uma Physical Store') 
    .setVersion('1.0')
    .addTag('stores')
    .build();

  const document = SwaggerModule.createDocument(app, config, {extraModels: []});
   
  if (document.components) {
    delete document.components.schemas;
  }

  SwaggerModule.setup('api', app, document);  

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT);
}
bootstrap();
