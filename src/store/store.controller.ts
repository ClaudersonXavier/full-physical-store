import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/createStoreDto';
import { CreateStoreByCepDto } from './dto/createStoreByCepDto';
import { UpdateStoreDto } from './dto/updateStoreDto';

@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  //Endpoits requisitados

  @Get('/listAll')
  async listALL() {
    const stores = await this.storeService.listAll();

    const response = {
      limit: stores.length,
      offset: 0,
      total: stores.length,
      stores,
    };

    return response;
  }

  @Get('/storeById/:id')
  async storeById(@Param('id') id: string) {
    const stores = await this.storeService.storeById(id);

    if (!stores) {
      throw new NotFoundException('Não há local com esse id.');
    }

    const response = {
      limit: 1,
      offset: 0,
      total: 1,
      stores,
    };

    return response;
  }

  @Get('/storeByCep/')
  async storeByCep(@Body() cep: { cep: string }) {
    const stores = await this.storeService.storeByCep(cep.cep);

    return stores;
  }

  @Get('/storeByState/:state')
  async storeByState(@Param('state') state: string) {
    const stores = await this.storeService.storeByState(state);

    const response = {
      limit: stores.length,
      offset: 0,
      total: stores.length,
      stores,
    };

    return response;
  }

  //Endpoints adicionais

  @Post('/create')
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Post('/createByCep')
  createStoreByCep(@Body() createStoreByCepDto: CreateStoreByCepDto) {
    return this.storeService.createStoreByCep(createStoreByCepDto);
  }

  @Delete('/delete/:id')
  deleteStore(@Param('id') id: string) {
    return this.storeService.deleteStore(id);
  }

  @Patch('/updateStore/:id')
  updateStore(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.updateStore(id, updateStoreDto);
  }
}
