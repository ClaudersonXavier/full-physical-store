import { Injectable } from '@nestjs/common';
import { Store, StoreSchema } from './model/store.schema';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStoreDto } from './dto/createStoreDto';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel('Store') private storeModel: Model<Store>
    ){}

    async findAll(): Promise<Store[]> {
        return await this.storeModel.find()
    }

    async findById(id: string): Promise<Store>{
        return await this.storeModel.findById(id)
    }

    async createStore(createStoreDto: CreateStoreDto): Promise<Store>{
        const newStore = new this.storeModel(createStoreDto)
        return await newStore.save()
    }

    async deleteStore(id: string){
        return await this.storeModel.findByIdAndDelete(id)
    }

}
