import {
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
} from 'class-validator';

export class CreateStoreDto {
  @IsNumberString()
  storeID: string;

  @IsString()
  storeName: string;

  @IsOptional()
  @IsNumber()
  shippingTimeInDays: number;

  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2: string;

  @IsOptional()
  @IsString()
  address3: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsString()
  type: string;

  @IsString()
  @IsPostalCode('BR')
  postalCode: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('BR')
  telephoneNumber: string;

  @IsOptional()
  @IsEmail()
  emailAddress: string;
}
