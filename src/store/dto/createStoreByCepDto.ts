import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator';

export class CreateStoreByCepDto {
  @IsString()
  storeID: string;

  @IsString()
  storeName: string;

  @IsNumber()
  @IsOptional()
  shippingTimeInDays: number;

  @IsString()
  type: string;

  @IsString()
  @IsPostalCode('BR')
  postalCode: string;

  @IsString()
  telephoneNumber: string;

  @IsEmail()
  emailAddress: string;
}
