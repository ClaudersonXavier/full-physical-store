import { Injectable } from '@nestjs/common';
import { Store } from './model/store.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStoreDto } from './dto/createStoreDto';
import { GoogleApiService } from '../utils/googleMapsService';
import { CreateStoreByCepDto } from './dto/createStoreByCepDto';
import { cepInfos } from '../utils/viaCepService';
import { UpdateStoreDto } from './dto/updateStoreDto';
import { calculateShipping } from '../utils/correiosService';

@Injectable()
export class StoreService {
  constructor(@InjectModel('Store') private storeModel: Model<Store>) {}

  async listAll(limit?: number, offset?: number): Promise<Store[]> {
    return await this.storeModel.find().skip(offset).limit(limit);
  }

  async storeById(id: string): Promise<Store> {
    if (!isNaN(Number(id))) {
      return await this.storeModel.findOne({ storeID: id });
    }

    return await this.storeModel.findById(id);
  }

  async storeByState(
    state: string,
    limit?: number,
    offset?: number,
  ): Promise<Store[]> {
    return this.storeModel.find({ state: state }).skip(offset).limit(limit);
  }

  async storeByCep(cep: string, limit?: number, offset?: number) {
    const userLocation = await GoogleApiService.getCordenates(cep);

    const stores = await this.storeModel.find();

    const nearbyStores = [];
    const pins = [];

    for (const store of stores) {
      const distance = await GoogleApiService.distanceCalculator(
        userLocation.latitude,
        userLocation.longitude,
        store.latitude,
        store.longitude,
      );

      if (distance <= 50) {
        nearbyStores.push({
          name: store.storeName,
          city: store.city,
          postalCode: store.postalCode,
          type: store.type,
          distance: `${distance.toFixed(2)} km`,
          value: [
            {
              prazo: '1 dia útil',
              price: 'R$ 15,00',
              description: 'Motoboy',
            },
          ],
        });

        pins.push({
          position: {
            lat: store.latitude,
            lng: store.longitude,
          },
          title: store.storeName,
        });
      } else if (store.type === 'LOJA' && distance >= 50) {
        const correiosResponse = await calculateShipping(cep, store.postalCode);
        nearbyStores.push({
          name: store.storeName,
          city: store.city,
          postalCode: store.postalCode,
          type: 'LOJA',
          distance: `${distance.toFixed(2)} km`,
          value: correiosResponse,
        });

        pins.push({
          position: {
            lat: store.latitude,
            lng: store.longitude,
          },
          title: store.storeName,
        });
      }
    }

    nearbyStores.sort((a, b) => {
      const distanceA = parseFloat(a.distance.replace(' km', ''));
      const distanceB = parseFloat(b.distance.replace(' km', ''));
      return distanceA - distanceB;
    });

    const paginatedStores = nearbyStores.slice(offset, offset + limit);

    if(paginatedStores.length === 0){
      return { message: 'Offset passou do range, reinforme novamene', status: 'Ok' };
    }

    return {
      limit,
      offset,
      total: nearbyStores.length,
      stores: paginatedStores,
      pins,
    };
  }

  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const newStore = new this.storeModel(createStoreDto);

    const coordenates = await GoogleApiService.getCordenates(
      createStoreDto.postalCode,
    );
    newStore.latitude = coordenates.latitude;
    newStore.longitude = coordenates.longitude;

    return await newStore.save();
  }

  async createStoreByCep(
    createStoreByCepDto: CreateStoreByCepDto,
  ): Promise<Store> {
    const newStore = new this.storeModel(createStoreByCepDto);
    const data = await cepInfos(createStoreByCepDto.postalCode);

    newStore.address1 = data.logradouro;
    newStore.city = data.localidade;
    newStore.district = data.bairro;
    newStore.state = data.uf;

    const coordenates = await GoogleApiService.getCordenates(
      createStoreByCepDto.postalCode,
    );

    newStore.latitude = coordenates.latitude;
    newStore.longitude = coordenates.longitude;

    return await newStore.save();
  }

  async deleteStore(id: string) {
    if (!isNaN(Number(id))) {
      return await this.storeModel.findOneAndDelete({ storeID: id });
    }

    return await this.storeModel.findByIdAndDelete(id);
  }

  async updateStore(id: string, updateStoreDto: UpdateStoreDto) {
    if (!isNaN(Number(id))) {
      const updatedStore = await this.storeModel.findOneAndUpdate(
        { storeID: id },
        updateStoreDto,
        {
          new: true,
          runValidators: true,
        },
      );

      if (updateStoreDto.postalCode) {
        const data = await cepInfos(updateStoreDto.postalCode);
        updatedStore.address1 = data.logradouro;
        updatedStore.city = data.localidade;
        updatedStore.district = data.bairro;
        updatedStore.state = data.uf;

        const coordenates = await GoogleApiService.getCordenates(
          updateStoreDto.postalCode,
        );

        updatedStore.latitude = coordenates.latitude;
        updatedStore.longitude = coordenates.longitude;
      }

      return updatedStore;
    }

    const updatedStore = await this.storeModel.findByIdAndUpdate(
      id,
      updateStoreDto,
      {
        new: true,
        runValidators: true,
      },
    );

    if (updateStoreDto.postalCode) {
      const data = await cepInfos(updateStoreDto.postalCode);
      updatedStore.address1 = data.logradouro;
      updatedStore.city = data.localidade;
      updatedStore.district = data.bairro;
      updatedStore.state = data.uf;

      const coordenates = await GoogleApiService.getCordenates(
        updateStoreDto.postalCode,
      );

      updatedStore.latitude = coordenates.latitude;
      updatedStore.longitude = coordenates.longitude;
    }

    return updatedStore;
  }

  async storeStateCount(state: string) {
    return (await this.storeModel.find({ state: state })).length;
  }
}
