import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/createStoreDto';
import { calcularFrete } from 'src/utils/correiosService';
import { CreateStoreByCepDto } from './dto/createStoreByCepDto';

@Controller('store')
export class StoreController {

    constructor(private storeService: StoreService){}

    @Get("/")
    findALL(){
       const stores = this.storeService.findAll()
       return stores
    }

    @Get("/:id")
    findById(@Param('id') id: string){
        return this.storeService.findById(id)
    }

    @Post("/create")
    createStore(@Body() createStoreDto: CreateStoreDto){
        return this.storeService.createStore(createStoreDto)
    }

    @Post("/createByCep")
    createStoreByCep(@Body() createStoreByCepDto: CreateStoreByCepDto){
        return this.storeService.createStoreByCep(createStoreByCepDto)
    }

    @Delete("/:id")
    deleteStore(@Param("id") id: string){
        return this.storeService.deleteStore(id)
    }


}
