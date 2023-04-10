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
import { CreateUserDto } from 'src/users/dto/users.dto';
import { UsersService } from 'src/users/services/users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/decorators/api-auth.decorator';
import { PerformanceInterceptor } from '../../interceptors/performance.interceptor';
import { User } from 'src/typeorm/user.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ExceptionResponse } from 'src/typeorm/user.entity';

@ApiTags('Customers')
@Controller('Customers')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiAuth()
  @UseInterceptors(PerformanceInterceptor, ClassSerializerInterceptor)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'This endpint returns all of the customers.',
    type: User,
  })
  getCustomers() {
    return this.usersService.getUsers();
  }

  @Get('id/:id')
  @ApiResponse({
    status: 200,
    description: 'This endpint return customer by provided ID.',
    type: User,
  })
  findUsersById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUsersById(id);
  }

  @Post('create')
  @ApiResponse({
    status: 200,
    description: 'Success response. Returns body of the created customer.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    type: ExceptionResponse,
    description: 'Exception response. Returns status code, message and error.',
  })
  @UsePipes(ValidationPipe)
  async createUsers(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    const allCustomers = await this.usersService.getUsers();

    const existingCustomerByEmail = allCustomers.find(
      (user) => user.email === createUserDto.email,
    );

    if (existingCustomerByEmail) {
      throw new BadRequestException(
        `Username or Email already exist in the database.`,
      );
    }

    return this.usersService.createUser(createUserDto);
  }
}
