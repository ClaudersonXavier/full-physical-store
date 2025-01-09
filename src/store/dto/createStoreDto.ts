import { IsEmail, IsNumberString, IsOptional, IsPhoneNumber, IsPostalCode, IsString } from "class-validator"

export class CreateStoreDto{

    @IsNumberString()
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
    country: string
        
    @IsString()
    type: string
      
    @IsString()
    @IsPostalCode("BR")
    postalCode: string
    
    @IsString()
    @IsPhoneNumber('BR')
    telephoneNumber: string
     
    @IsEmail()
    emailAddress: string
}