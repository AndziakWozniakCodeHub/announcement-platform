import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateCustomerDto } from 'src/users/dto/customers.dto';
import { CustomersService } from 'src/users/services/customers.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/decorators/api-auth.decorator';
import { PerformanceInterceptor } from '../../interceptors/performance.interceptor';
import { Customer } from 'src/typeorm/customer.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ExceptionResponse } from 'src/typeorm/customer.entity';

@ApiTags('Customers')
@Controller('Customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiAuth()
  @UseInterceptors(PerformanceInterceptor, ClassSerializerInterceptor)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'This endpint returns all of the customers.',
    type: Customer,
  })
  getCustomers() {
    return this.customersService.getUsers();
  }

  @Get('id/:id')
  @ApiResponse({
    status: 200,
    description: 'This endpint return customer by provided ID.',
    type: Customer,
  })
  findUsersById(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findUsersById(id);
  }

  @Post('create')
  @ApiResponse({
    status: 200,
    description: 'Success response. Returns body of the created customer.',
    type: Customer,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionResponse,
    description: 'Exception response. Returns status code, message and error.',
  })
  @UsePipes(ValidationPipe)
  async createUsers(
    @Body() createUserDto: CreateCustomerDto,
  ): Promise<Customer> {
    const allCustomers = await this.customersService.getUsers();

    const existingCustomerByEmail = allCustomers.find(
      (customer) => customer.email === createUserDto.email,
    );

    if (existingCustomerByEmail) {
      throw new BadRequestException(
        `Username or Email already exist in the database.`,
      );
    }

    return this.customersService.createUser(createUserDto);
  }
}
