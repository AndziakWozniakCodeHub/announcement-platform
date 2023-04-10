import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/typeorm';
import { CustomersController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { AuthService } from '../auth/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
// import { ConfigService } from 'src/config/config.service';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '../auth/controllers/auth.controller';
import { Role } from 'src/typeorm/customer.entity';
import { CustomersAdminController } from './controllers/customers-admin.controller';
import { Offer } from 'src/typeorm/offer.entity';
import { CustomersContractController } from './controllers/customers-contract.controller';
import { Contract } from 'src/typeorm/contract.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Role, Offer, Contract]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: '123456',
        signOptions: { expiresIn: '4d' },
      }),
    }),
  ],
  controllers: [
    CustomersController,
    AuthController,
    CustomersAdminController,
    CustomersContractController,
  ],
  providers: [CustomersService, AuthService],
  exports: [CustomersService, AuthService],
})
export class CustomersModule {}
