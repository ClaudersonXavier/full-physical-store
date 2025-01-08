import { IsEmail, IsPostalCode, IsString } from "class-validator"

export class CreateStoreByCepDto{

    @IsString()
    storeID: string

    @IsString()
    storeName: string
        
    @IsString()
    type: string
      
    @IsString()
    @IsPostalCode("BR")
    postalCode: string
    
    @IsString()
    telephoneNumber: string
     
    @IsEmail()
    emailAddress: string
}