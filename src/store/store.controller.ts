import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/createStoreDto';
import { calcularFrete } from 'src/utils/correiosService';
import { CreateStoreByCepDto } from './dto/createStoreByCepDto';
import { UpdateStoreDto } from './dto/updateStoreDto';

@Controller('store')
export class StoreController {

    constructor(private storeService: StoreService){}

    //Endpoits requisitados

    @Get("/listAll")
    listALL(){
       const stores = this.storeService.listAll()
       return stores
    }

    @Get("/storeById/:id")
    storeById(@Param('id') id: string){
        return this.storeService.storeById(id)
    }

    @Get("/storeByCep/")
    storeByCep(@Body() cep){
        return this.storeService.storeByCep(cep.cep)
    }

    @Get('/storeByState/:state')
    storeByState(@Param('state') state: string){
        return this.storeService.storeByState(state)
    }

    //Endpoints adicionais

    @Post("/create")
    createStore(@Body() createStoreDto: CreateStoreDto){
        return this.storeService.createStore(createStoreDto)
    }

    @Post("/createByCep")
    createStoreByCep(@Body() createStoreByCepDto: CreateStoreByCepDto){
        return this.storeService.createStoreByCep(createStoreByCepDto)
    }

    @Delete("/delete/:id")
    deleteStore(@Param("id") id: string){
        return this.storeService.deleteStore(id)
    }

    @Patch('/updateStore/:id')
    updateStore(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto){
        return this.storeService.updateStore(id, updateStoreDto)
    }


}
