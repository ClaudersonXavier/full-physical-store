import { IsEmail, IsOptional, IsPostalCode, IsString } from "class-validator"

export class CreateStoreDto{

    @IsString()
    storeID: string

    @IsString()
    storeName: string

    @IsString()
    address1: string

    @IsOptional()
    @IsString()
    address2: string

    @IsOptional()
    @IsString()
    address3: string

    @IsString()
    city: string

    @IsString()
    district: string
    
    @IsString()
    state: string
        
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