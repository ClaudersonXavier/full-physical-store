import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/createStoreDto';

@Controller('store')
export class StoreController {

    constructor(private storeService: StoreService){}

    @Get("/")
    findALL(){
       return this.storeService.findAll() 
    }

    @Get("/:id")
    findById(@Param('id') id: string){
        return this.storeService.findById(id)
    }

    @Post("/create")
    createStore(@Body() createStoreDto: CreateStoreDto){
        return this.storeService.createStore(createStoreDto)
    }

    @Delete("/:id")
    deleteStore(@Param("id") id: string){
        return this.storeService.deleteStore(id)
    }


}
