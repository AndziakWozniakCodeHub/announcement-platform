import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Body,
  ValidationPipe,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PerformanceInterceptor } from '../../interceptors/performance.interceptor';
import { AuthService } from '../services/auth.service';
import { CustomersService } from '../../users/services/customers.service';
import { Auth } from '../decorators/auth.decorator';
import { Customer } from 'src/typeorm/customer.entity';
import { ApiAuth } from '../decorators/api-auth.decorator';
import {
  AuthLoginDto,
  AuthLoginResponse,
  AuthRegisterDto,
} from '../dto/auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private customersService: CustomersService,
  ) {}

  @Get()
  @ApiAuth()
  @UseInterceptors(PerformanceInterceptor, ClassSerializerInterceptor)
  @ApiResponse({
    status: 200,
    description: 'User is logged in.',
    type: Customer,
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token required.',
  })
  me(@Auth() customer: Customer) {
    return customer;
  }

  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'User has been registred.',
    type: Customer,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request: invalid payload / email already taken.',
  })
  async register(@Body(new ValidationPipe()) data: AuthRegisterDto) {
    const [exists] = await this.customersService.findBy({ email: data.email });

    if (exists) {
      throw new BadRequestException(`Email ${data.email} already taken.`);
    }

    const password = await this.authService.encodePassword(data.password);

    const customer = await this.customersService.createUser({
      ...data,
      password,
    });

    return customer;
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User has been logged in.',
    type: AuthLoginResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request: invalid payload / credentials are invalid.',
    type: AuthLoginResponse,
  })
  async login(@Body(new ValidationPipe()) data: AuthLoginDto) {
    const customer = await this.authService.validateUser(
      data.email,
      data.password,
    );

    if (!customer) {
      throw new BadRequestException('Credentials are invalid.');
    }

    const token = await this.authService.encodeUserToken(customer);

    return { token, customer };
  }
}
