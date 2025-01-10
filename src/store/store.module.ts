import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './model/store.schema';
import { ConfigModule } from '@nestjs/config';
import { StoreService } from './store.service';

@Module({
  controllers: [StoreController],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE),
    MongooseModule.forFeature([
      {
        name: 'Store',
        schema: StoreSchema,
      },
    ]),
  ],
  providers: [StoreService],
})
export class StoreModule {}
