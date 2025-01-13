import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'ID da loja',
    example: '123456',
  })
  @IsNumberString()
  storeID: string;

  @ApiProperty({
    description: 'Nome da loja',
    example: 'ClauStore',
  })
  @IsString()
  storeName: string;

  @ApiProperty({
    description: 'Tempo de entrega em dias (opcional)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  shippingTimeInDays: number;

  @ApiProperty({
    description: 'Endereço 1 da loja',
    example: 'Rua das Flores, 123',
  })
  @IsString()
  address1: string;

  @ApiProperty({
    description: 'Endereço 2 da loja (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  address2: string;

  @ApiProperty({
    description: 'Endereço 3 da loja (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  address3: string;

  @ApiProperty({
    description: 'Cidade da loja',
    example: 'São Paulo',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Bairro da loja',
    example: 'Centro',
  })
  @IsString()
  district: string;

  @ApiProperty({
    description: 'Estado da loja',
    example: 'SP',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'País da loja',
    example: 'Brasil',
    required: false,
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Tipo de loja (PDV/LOJA)',
    example: 'LOJA',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'CEP da loja',
    example: '12345-678',
  })
  @IsString()
  @IsPostalCode('BR')
  postalCode: string;

  @ApiProperty({
    description: 'Número de telefone da loja (opcional)',
    example: '87 98179-0585',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('BR')
  telephoneNumber: string;

  @ApiProperty({
    description: 'Endereço de e-mail da loja (opcional)',
    example: 'ClauStore@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  emailAddress?: string;
}
