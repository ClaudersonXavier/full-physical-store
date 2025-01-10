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
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('stores')
@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  //Endpoits requisitados

  @Get('/listAll')
  @ApiOperation({ summary: 'Lista todas as lojas' })  
  @ApiQuery({name: 'limit', required: false, type: Number, description: 'Número máximo de lojas a serem retornadas'})
  @ApiQuery({name: 'offset', required: false, type: Number, description: 'Número de páginas a serem puladas'})
  @ApiResponse({status: 200, description: 'Lista de lojas retornada com sucesso',})
  @ApiResponse({status: 404,description: 'Não há lojas cadastradas',})
  async listALL(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    const totalStore = await this.storeService.listAll(limit, offset);
    
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
  @ApiOperation({ summary: 'Busca uma loja por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID da loja, tanto o dado pelo usuário como o do banco de dados funcionam' }) 
  @ApiResponse({ status: 200, description: 'Loja encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })
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
  @ApiOperation({ summary: 'Busca lojas por CEP' })
  @ApiQuery({name: 'limit', required: false, type: Number, description: 'Número máximo de lojas a serem retornadas'})
  @ApiQuery({name: 'offset', required: false, type: Number, description: 'Número de páginas a serem puladas'})
  @ApiResponse({ status: 200, description: 'Lojas encontradas com sucesso' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })
  async storeByCep(
    @Body() cep: { cep: string },
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
  @ApiOperation({ summary: 'Busca lojas por estado' })
  @ApiParam({ name: 'state', type: String, description: 'Sigla do estado' })  
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número máximo de lojas a serem retornadas'})
  @ApiQuery({name: 'offset', required: false, type: Number, description: 'Número de páginas a serem puladas'})
  @ApiResponse({ status: 200, description: 'Lojas encontradas com sucesso' })
  @ApiResponse({ status: 404, description: 'Lojas não encontradas para o estado' })
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
  @ApiOperation({ summary: 'Cria uma nova loja' })
  @ApiResponse({ status: 201, description: 'Loja criada com sucesso', type: Object })
  async createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Post('/createByCep')
  @ApiOperation({ summary: 'Cria uma nova loja utilizando o CEP' })
  @ApiResponse({ status: 201, description: 'Loja criada com sucesso', type: Object })
  async createStoreByCep(@Body() createStoreByCepDto: CreateStoreByCepDto) {
    return this.storeService.createStoreByCep(createStoreByCepDto);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Deleta uma loja' })
  @ApiParam({ name: 'id', type: String, description: 'ID da loja a ser deletada' })
  @ApiResponse({ status: 200, description: 'Loja deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })
  async deleteStore(@Param('id') id: string) {
    const store = await this.storeService.deleteStore(id);

    if (!store) {
      return { message: 'Não há local com esse id.', status: 'Ok' };
    }

    return store;
  }

  @Patch('/updateStore/:id')
  @ApiOperation({ summary: 'Atualiza os dados de uma loja' })
  @ApiParam({ name: 'id', type: String, description: 'ID da loja a ser atualizada' })
  @ApiResponse({ status: 200, description: 'Loja atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada', type: Object })
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
