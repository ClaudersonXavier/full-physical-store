import { Injectable } from '@nestjs/common';
import { Store, StoreSchema } from './model/store.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStoreDto } from './dto/createStoreDto';
import { GoogleApiService } from 'src/utils/googleMapsService';
import { CreateStoreByCepDto } from './dto/createStoreByCepDto';
import { cepInfos } from 'src/utils/viaCepService';
import { UpdateStoreDto } from './dto/updateStoreDto';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel('Store') private storeModel: Model<Store>
    ){}

    async listAll(): Promise<Store[]> {
        return await this.storeModel.find()
    }

    async storeById(id: string): Promise<Store>{

        if(!isNaN(Number(id))){
            return await this.storeModel.findOne({storeID: id})
        }    
       
        return await this.storeModel.findById(id)
        
    }

    async storeByState(state: string): Promise<Store[]> {
        return this.storeModel.find({state: state})
    }

    async storeByCep(cep: string){

        try{
           
            const userLocation = await GoogleApiService.getCordenates(cep);
            const stores = await this.storeModel.find(); // Busca as lojas no banco de dados.
            const nearbyStores = [];

            console.log(userLocation)

            for (const store of stores) {
                const distancia = await GoogleApiService.distanceCalculator(
                    userLocation.latitude,
                    userLocation.longitude,
                    store.latitude,
                    store.longitude
                );

                if (distancia <= 50) {
                    const storeWithDistance = {
                        ...store.toObject(),
                        distancia,
                    };
                    nearbyStores.push(storeWithDistance);
                }
            }
     
            return nearbyStores;
        }catch(error){
             
             throw new Error(error);
        }
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

    async updateStore(id: string, updateStoreDto: UpdateStoreDto){
        
        if(!isNaN(Number(id))){
            const updatedStore = await this.storeModel.findOneAndUpdate({storeID: id}, updateStoreDto,{
                new: true,
                runValidators: true
            })

            if(updateStoreDto.postalCode){
                const data = await cepInfos(updateStoreDto.postalCode)
                updatedStore.address1 = data.logradouro
                updatedStore.city = data.localidade
                updatedStore.district = data.bairro
                updatedStore.state = data.uf

                const coordenates = await GoogleApiService.getCordenates(updateStoreDto.postalCode)

                updatedStore.latitude = coordenates.latitude
                updatedStore.longitude = coordenates.longitude 
            }
            
            return updatedStore
        }

        const updatedStore = await this.storeModel.findByIdAndUpdate(id, updateStoreDto,{
            new: true,
            runValidators: true
        })

        if(updateStoreDto.postalCode){
            const data = await cepInfos(updateStoreDto.postalCode)
            updatedStore.address1 = data.logradouro
            updatedStore.city = data.localidade
            updatedStore.district = data.bairro
            updatedStore.state = data.uf

            const coordenates = await GoogleApiService.getCordenates(updateStoreDto.postalCode)

            updatedStore.latitude = coordenates.latitude
            updatedStore.longitude = coordenates.longitude 
        }
        
        return updatedStore
    }


}
