import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
} from 'class-validator';

export class CreateStoreByCepDto {
  
  @IsString()
  storeID: string;

  @IsString()
  storeName: string;

  @IsOptional()
  @IsNumber()
  shippingTimeInDays: number;

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
