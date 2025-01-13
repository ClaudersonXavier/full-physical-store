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
  @ApiProperty({
    description: 'ID da loja',
    example: '123456',
  })
  @IsString()
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
    description: 'Tipo de loja (LOJA/PDV)',
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
  emailAddress: string;
}
