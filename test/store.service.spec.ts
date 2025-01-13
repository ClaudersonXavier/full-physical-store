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
  let limit = 10
  let offset = 0

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create({instance: {
      storageEngine: 'wiredTiger', 
    }})
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
      "city": "Caruaru",
      "district": "Heliopolis",
      "state": "PE",
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

  it("Achando loja pelo id", async () => {
    const store = await service.storeById("122345");  
    expect(store.storeName).toEqual("LOJA B"); 
  })

  it("Achando as lojas pelo estado", async () => {
    const store = await service.createStore({
      "storeID": "631213",
      "storeName": "LOJA D",
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
    const storeInState = await service.storeByState("PE", limit, offset);  
    expect(storeInState).toHaveLength(2); 
    expect(storeInState[0].storeName).toEqual("LOJA A");
  })

  it("Criando uma loja", async () =>{
    const store = await service.createStore({
      "storeID": "631213",
      "storeName": "LOJA D",
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
    expect(stores[2].storeName).toEqual("LOJA D");
  })

  it("Criando uma loja pelo CEP", async () =>{
    const store = await service.createStoreByCep({
        "storeID": "413123",
        "storeName": "LOJA D",
        "type": "PDV",
        "postalCode": "55296-512",
        "telephoneNumber": "87 98279-0585",
        "emailAddress": "xavierclauderson98@gmail.com",
        shippingTimeInDays: 0
    });
  
    const stores = await service.listAll();
    expect(stores).toHaveLength(3); 
    expect(stores[2].storeName).toEqual("LOJA D");
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

  it("Achando uma loja pelo CEP (PDV +50, LOJA -50)", async () =>{
    const stores = await service.storeByCep("55293-290", limit, offset)
    expect(stores.total).toEqual(1);
    expect(stores.stores[0].name).toEqual("LOJA A")
    expect(stores.stores[0].value[0]).toEqual({
      prazo: '1 dia útil',
      price: 'R$ 15,00',
      description: 'Motoboy',
    })
  })

  it("Achando uma loja pelo CEP (PDV -50, LOJA +50)", async () =>{
    const stores = await service.storeByCep("55016-400", limit, offset)
    expect(stores.total).toEqual(2);
    expect(stores.stores[0].name).toEqual("LOJA B")
    expect(stores.stores[0].value[0]).toEqual({
      prazo: '1 dia útil',
      price: 'R$ 15,00',
      description: 'Motoboy',
    })

    expect(stores.stores[1].name).toEqual("LOJA A")
    expect(stores.stores[1].value).toEqual({value: 
    [{
      "prazo": "3 dias úteis",
      "codProdutoAgencia": "04014",
      "preco": "R$ 27,00",
      "description": "Sedex a encomenda expressa dos Correios"
     },
     {
      "prazo": "7 dias úteis",
      "codProdutoAgencia": "04510",
      "preco": "R$ 25,50",
      "description": "PAC a encomenda economica dos Correios"
     }
    ]})
  })

  it("Achando uma loja pelo CEP (LOJA +50 e LOJA -50)", async () =>{

    await service.createStore({
      "storeID": "871213",
      "storeName": "LOJA C",
      "address1": "Av. Pedro Cavalcante",
      "city": "São Paulo",
      "district": "Morumbi",
      "state": "SP",
      "country": "Brasil",
      "type": "LOJA",
      "postalCode": "05606-010",
      "telephoneNumber": "87 98279-0585",
      "emailAddress": "xavierclauderson98@gmail.com",
      shippingTimeInDays: 0,
      address2: '',
      address3: ''
    })

    const stores = await service.storeByCep("05654-060", limit, offset)

    expect(stores.total).toEqual(2);
    expect(stores.stores[0].name).toEqual("LOJA C")
    expect(stores.stores[0].value[0]).toEqual({
      prazo: '1 dia útil',
      price: 'R$ 15,00',
      description: 'Motoboy',
    })

    expect(stores.stores[1].name).toEqual("LOJA A")
    expect(stores.stores[1].value).toEqual({value: 
    [{
      "prazo": "3 dias úteis",
      "codProdutoAgencia": "04014",
      "preco": "R$ 102,60",
      "description": "Sedex a encomenda expressa dos Correios"
     },
     {
      "prazo": "7 dias úteis",
      "codProdutoAgencia": "04510",
      "preco": "R$ 83,20",
      "description": "PAC a encomenda economica dos Correios"
     }
    ]})
  })

  it("Achando uma loja pelo CEP (PDV +50 e PDV -50)", async () =>{
    
    service.deleteStore("761239") //Apagando a do tipo loja para melhor analise

    await service.createStore({
      "storeID": "871213",
      "storeName": "LOJA C",
      "address1": "Av. Pedro Cavalcante",
      "city": "São Paulo",
      "district": "Morumbi",
      "state": "SP",
      "country": "Brasil",
      "type": "PDV",
      "postalCode": "05606-010",
      "telephoneNumber": "87 98279-0585",
      "emailAddress": "xavierclauderson98@gmail.com",
      shippingTimeInDays: 0,
      address2: '',
      address3: ''
    })

    const stores = await service.storeByCep("05654-060", limit, offset)

    expect(stores.total).toEqual(1);
    expect(stores.stores[0].name).toEqual("LOJA C")
    expect(stores.stores[0].value[0]).toEqual({
      prazo: '1 dia útil',
      price: 'R$ 15,00',
      description: 'Motoboy',
    })

  })

  it("Achando uma loja pelo CEP (LOJA +50 e PDV +50)", async () =>{
    const stores = await service.storeByCep("05654-060", limit, offset)
    expect(stores.total).toEqual(1);
    expect(stores.stores[0].name).toEqual("LOJA A")
    expect(stores.stores[0].value).toEqual({value: 
      [{
        "prazo": "3 dias úteis",
        "codProdutoAgencia": "04014",
        "preco": "R$ 102,60",
        "description": "Sedex a encomenda expressa dos Correios"
       },
       {
        "prazo": "7 dias úteis",
        "codProdutoAgencia": "04510",
        "preco": "R$ 83,20",
        "description": "PAC a encomenda economica dos Correios"
       }
      ]})

  })

  it("Achando uma loja pelo CEP (LOJA -50 e PDV -50)", async () =>{
    const store = await service.createStoreByCep({
      "storeID": "413123",
      "storeName": "LOJA C",
      "type": "PDV",
      "postalCode": "55293-290",
      "telephoneNumber": "87 98279-0585",
      "emailAddress": "xavierclauderson98@gmail.com",
      shippingTimeInDays: 0
    });

    const stores = await service.storeByCep(" 55294-273", limit, offset)

    expect(stores.total).toEqual(2);
    expect(stores.stores[0].name).toEqual("LOJA C")
    expect(stores.stores[0].value[0]).toEqual({
      prazo: '1 dia útil',
      price: 'R$ 15,00',
      description: 'Motoboy',
    })
    expect(stores.stores[1].name).toEqual("LOJA A")
    expect(stores.stores[1].value[0]).toEqual({
      prazo: '1 dia útil',
      price: 'R$ 15,00',
      description: 'Motoboy',
    })
  })

  it("Teste com o cep requisitado", async () =>{
    service.deleteStore("761239") //Apagando a do tipo loja para melhor analise

    const store = await service.createStoreByCep({
      "storeID": "413123",
      "storeName": "LOJA C",
      "type": "PDV",
      "postalCode": "91349-900",
      "telephoneNumber": "87 98279-0585",
      "emailAddress": "xavierclauderson98@gmail.com",
      shippingTimeInDays: 0
    });

    const stores = await service.storeByCep("90230-270", limit, offset)

    expect(stores.total).toEqual(1);
    expect(stores.stores[0].name).toEqual("LOJA C")
    expect(stores.stores[0].value[0]).toEqual({
      prazo: '1 dia útil',
      price: 'R$ 15,00',
      description: 'Motoboy',
    })
  })

  afterEach(async () => {
    await storeModel.deleteMany({});
    await mongoServer.stop();
  });
});
