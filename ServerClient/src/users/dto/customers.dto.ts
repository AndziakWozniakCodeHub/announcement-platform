import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  customer_name: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
