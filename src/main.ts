import { NestFactory } from '@nestjs/core';
import { StoreModule } from './store/store.module';

async function bootstrap() {
  const app = await NestFactory.create(StoreModule);
  await app.listen(process.env.PORT);
}
bootstrap();
