import { Injectable } from '@nestjs/common';
import { Store } from './model/store.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStoreDto } from './dto/createStoreDto';
import { GoogleApiService } from 'src/utils/googleMapsService';
import { CreateStoreByCepDto } from './dto/createStoreByCepDto';
import { cepInfos } from 'src/utils/viaCepService';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel('Store') private storeModel: Model<Store>
    ){}

    async findAll(): Promise<Store[]> {
        return await this.storeModel.find()
    }

    async findById(id: string): Promise<Store>{

        if(!isNaN(Number(id))){
            return await this.storeModel.findOne({storeID: id})
        }    
       
        return await this.storeModel.findById(id)
        
    }

    async createStore(createStoreDto: CreateStoreDto): Promise<Store>{
        const newStore = new this.storeModel(createStoreDto)
        
        const coordenates = await GoogleApiService.getCordenates(createStoreDto.postalCode)
        newStore.latitude = coordenates.latitude
        newStore.longitude = coordenates.longitude  
              
        return await newStore.save()
    }

    async createStoreByCep(createStoreByCepDto: CreateStoreByCepDto): Promise<Store>{
        const newStore = new this.storeModel(createStoreByCepDto)
        const data = await cepInfos(createStoreByCepDto.postalCode)

        newStore.address1 = data.logradouro
        newStore.city = data.localidade
        newStore.district = data.bairro
        newStore.state = data.uf

        const coordenates = await GoogleApiService.getCordenates(createStoreByCepDto.postalCode)

        newStore.latitude = coordenates.latitude
        newStore.longitude = coordenates.longitude  
              
        return await newStore.save()
    }

    async deleteStore(id: string){

        if(!isNaN(Number(id))){
            return await this.storeModel.findOne({storeID: id})
        }  

        return await this.storeModel.findByIdAndDelete(id)
    }

}
