import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Store {

    @Prop({
        required: [true, "O local deve ter um ID."],
        minlength: [6, "O id deve ter 6 númeors."],
        maxlength: [6, "O id deve ter 6 númeors."],
        unique: [true, "Já existe um local com esse ID"]
    })
    storeID: string

    @Prop({
        required: [true, "O local deve ter um nome."],
        minlength: [2, "O nome do local deve ter pelo menos 2 caracteres."]
    })
    storeName: string
    
    @Prop({default: true}) // considerar que sempre tem o produto
    takeOutInStore: boolean

    @Prop()
    shippingTimeInDays: number

    @Prop()
    latitude: string

    @Prop()
    longitude: string

    @Prop({
        required: [true, "O local deve ter pelo menos um endereço."],
        minlength: [3, "O endereço tem que ter pelo menos 3 caracteres."]
    })
    address1: string
    
    @Prop()
    address2: string

    @Prop()
    address3: string

    @Prop({
        required: [true, "O local deve informar em que cidade está situado."],
        minlength: [3, "O nome da cidade tem que ter pelo menos 3 caracteres."]
    })
    city: string

    @Prop({
        required: [true, "O local deve informar em qual distrito está situado."],
        minlength: [3, "O nome do distrito tem que ter pelo menos 3 caracteres."]
    })
    district: string

    @Prop({
        required: [true, "O local deve informar em qual estado está situado."],
        minlength: [2, "Digite a sigla do Estado!"],
        maxlength: [2, "Digite a sigla do Estado!"]
    })
    state: string
    

    @Prop({
        required: [true, "O local deve informar em qual estado está situado."],
        minlength: [3, "O nome do estado tem que ter pelo menos 3 caracteres."],
        enum: ['PDV', 'LOJA'] // Só pode ser uma dessas opções
    })
    type: string
  

    @Prop({
        required: [true, "O local deve informar em qual país está situado."],
        minlength: [3, "O nome do estado tem que ter pelo menos 3 caracteres."],
        default: "Brasil"
    })
    country: string
    

    @Prop({
        required: [true, "O local deve informar seu CEP."]
    })
    postalCode: string


    @Prop({
        required: [true, "O local deve informar seu número."]
    })
    telephoneNumber: string
 

    @Prop({
        required: [true, "O local deve informar seu email."]
    })
    emailAddress: string
    

}

export const StoreSchema =  SchemaFactory.createForClass(Store);