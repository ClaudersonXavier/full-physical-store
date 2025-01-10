import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
  async listALL(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    const totalStore = await this.storeService.listAll();
    
    if (totalStore.length === 0) {
      return { message: 'Não há lojas cadastradas', status: 'Ok' };
    }

    const stores = await this.storeService.listAll(limit, offset);

    if(stores.length === 0){
      return { message: 'Offset passou do range, reinforme novamene', status: 'Ok' };
    }

    const response = {
      limit: limit,
      offset: offset,
      total: totalStore.length,
      stores,
    };

    return response;
  }

  @Get('/storeById/:id')
  async storeById(@Param('id') id: string) {
    const stores = await this.storeService.storeById(id);

    if (!stores) {
      return { message: 'Não há local com esse id.', status: 'Ok' };
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
  async storeByCep(
    @Body('cep') cep: { cep: string },
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {

    const totalStore = await this.storeService.listAll();
    
    if (totalStore.length === 0) {
      return { message: 'Não há lojas cadastradas', status: 'Ok' };
    }
    
    const stores = await this.storeService.storeByCep(cep.cep, limit, offset);

    return stores;
  }

  @Get('/storeByState/:state')
  async storeByState(
    @Param('state') state: string,
    @Query('limit')limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    const stores = await this.storeService.storeByState(state, limit, offset);

    if (!stores) {
      return { message: 'Não há locais presentes nesse estado.', status: 'Ok' };
    }

    const storesInStateTotal = this.storeService.storeStateCount(state);

    const response = {
      limit: limit,
      offset: offset,
      total: storesInStateTotal,
      stores,
    };

    return response;
  }

  //Endpoints adicionais

  @Post('/create')
  async createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Post('/createByCep')
  async createStoreByCep(@Body() createStoreByCepDto: CreateStoreByCepDto) {
    return this.storeService.createStoreByCep(createStoreByCepDto);
  }

  @Delete('/delete/:id')
  async deleteStore(@Param('id') id: string) {
    const store = await this.storeService.deleteStore(id);

    if (!store) {
      return { message: 'Não há local com esse id.', status: 'Ok' };
    }

    return store;
  }

  @Patch('/updateStore/:id')
  async updateStore(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const store = this.storeService.updateStore(id, updateStoreDto);

    if (!store) {
      return { message: 'Não há local com esse id.', status: 'Ok' };
    }
    return store;
  }
}
