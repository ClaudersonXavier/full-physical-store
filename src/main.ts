import { NestFactory } from '@nestjs/core';
import { StoreModule } from './store/store.module';
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(StoreModule);
  await app.listen(process.env.PORT);
}
bootstrap();
