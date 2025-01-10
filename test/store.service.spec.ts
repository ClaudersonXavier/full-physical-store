import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from '../src/store/store.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreSchema } from '../src/store/model/store.schema';
import { ConfigModule } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('testes do StoreService', () => {
  let service: StoreService;
  let storeModel: Model<Store>;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
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
      providers: [
        StoreService,
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    storeModel = module.get<Model<Store>>(getModelToken('Store'));

    await service.createStore({
        "storeID": "761239",
        "storeName": "LOJA A",
        "address1": "Av. Pedro Cavalcante",
        "city": "Garanhuns",
        "district": "Heliopolis",
        "state": "PE",
        "country": "Brasil",
        "type": "LOJA",
        "postalCode": "55296-512",
        "telephoneNumber": "87 98279-0585",
        "emailAddress": "xavierclauderson98@gmail.com",
        shippingTimeInDays: 0,
        address2: '',
        address3: ''
    })

    await service.createStore({
      "storeID": "122345",
      "storeName": "LOJA B",
      "address1": "Av. Pedro Cavalcante",
      "city": "Garanhuns",
      "district": "Heliopolis",
      "state": "SP",
      "country": "Brasil",
      "type": "PDV",
      "postalCode": "55012-290",
      "telephoneNumber": "87 98279-0585",
      "emailAddress": "xavierclauderson98@gmail.com",
      shippingTimeInDays: 0,
      address2: '',
      address3: ''
  })
  });

  it('Verificando se está definido', () => {
    expect(service).toBeDefined();  
  });

  it('Testando listar todos', async () => {
    const stores = await service.listAll();  
    expect(stores).toHaveLength(2);  
  });

  it("Achando loja pleo id", async () => {
    const store = await service.storeById("122345");  
    expect(store.storeName).toEqual("LOJA B"); 
  })

  it("Achando as lojas pelo estado", async () => {
    const store = await service.storeByState("PE");  
    expect(store).toHaveLength(1); 
    expect(store[0].storeName).toEqual("LOJA A");
  })

  it("Criando uma loja", async () =>{
    const store = await service.createStore({
      "storeID": "631213",
      "storeName": "LOJA C",
      "address1": "Av. Pedro Cavalcante",
      "city": "Garanhuns",
      "district": "Heliopolis",
      "state": "SP",
      "country": "Brasil",
      "type": "PDV",
      "postalCode": "55293-290",
      "telephoneNumber": "87 98279-0585",
      "emailAddress": "xavierclauderson98@gmail.com",
      shippingTimeInDays: 0,
      address2: '',
      address3: ''
    });
  
    const stores = await service.listAll();
    expect(stores).toHaveLength(3); 
    expect(stores[2].storeName).toEqual("LOJA C");
  })

  it("Criando uma loja pelo CEP", async () =>{
    const store = await service.createStoreByCep({
        "storeID": "413123",
        "storeName": "LOJA C",
        "type": "PDV",
        "postalCode": "55296-512",
        "telephoneNumber": "87 98279-0585",
        "emailAddress": "xavierclauderson98@gmail.com",
        shippingTimeInDays: 0
    });
  
    const stores = await service.listAll();
    expect(stores).toHaveLength(3); 
    expect(stores[2].storeName).toEqual("LOJA C");
  })

  it("Deletando uma loja pelo id", async () =>{
    const store = await service.deleteStore('122345');
  
    const stores = await service.listAll();
    expect(stores).toHaveLength(1); 
    expect(store.storeName).toEqual("LOJA B");
  })

  it("Atualizando uma loja pelo id", async () =>{
    const store = await service.updateStore('122345', {
      "storeName": "LOJA BAO"
    });
   
    expect(store.storeName).toEqual("LOJA BAO");
  })

  
});
