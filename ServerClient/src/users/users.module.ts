import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { AuthService } from '../auth/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '../auth/controllers/auth.controller';
import { Role } from 'src/typeorm/user.entity';
import { UsersAdminController } from './controllers/users-admin.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Role]),
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
    UsersController,
    AuthController,
    UsersAdminController,
  ],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class CustomersModule {}
