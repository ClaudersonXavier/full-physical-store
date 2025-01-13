import { Model } from 'mongoose';
import { StoreService } from '../src/store/store.service';
import { Store, StoreSchema } from '../src/store/model/store.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { StoreController } from '../src/store/store.controller';

describe('testes as rotas e suas respostas do StoreController', () => {
  let controller: StoreController;
  let storeModel: Model<Store>;
  let mongoServer: MongoMemoryServer;
  const limit = 10;
  const offset = 0;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        storageEngine: 'wiredTiger',
      },
    });
    const uri = mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          {
            name: 'Store',
            schema: StoreSchema,
          },
        ]),
      ],
      providers: [StoreService, StoreController],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    storeModel = module.get<Model<Store>>(getModelToken('Store'));
  });

  it('Verificando se está definido', () => {
    expect(controller).toBeDefined();
  });

  it('Verificando resposta quando não há loja', async () => {
    const store = await controller.listALL(limit, offset);

    expect(store).toEqual({
      message: 'Não há lojas cadastradas',
      status: 'Ok',
    });
  });

  it('Verificando resposta quando não há loja com o id buscado', async () => {
    const store = await controller.storeById('122345');

    expect(store).toEqual({
      message: 'Não há local com esse id.',
      status: 'Ok',
    });
  });

  it('Verificando resposta quando não há loja no estado selecionado', async () => {
    const store = await controller.storeByState('AC');

    expect(store).toEqual({
      message: 'Não há locais presentes nesse estado.',
      status: 'Ok',
    });
  });

  it('Verificando resposta quando tenta deletar uma loja com um id inexistente', async () => {
    const store = await controller.deleteStore('122345');

    expect(store).toEqual({
      message: 'Não há local com esse id.',
      status: 'Ok',
    });
  });

  it('Verificando resposta quando tenta editar uma loja com um id inexistente', async () => {
    const store = await controller.updateStore('122345', {
      storeName: 'LOJA C',
    });

    expect(store).toEqual({
      message: 'Não há local com esse id.',
      status: 'Ok',
    });
  });

  afterEach(async () => {
    await storeModel.deleteMany({});
    await mongoServer.stop();
  });
});
