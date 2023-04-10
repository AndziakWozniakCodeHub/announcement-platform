import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from 'src/typeorm';
import { RequestPayload, TokenPayload } from 'src/typeorm/user.entity';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async encodeUserToken(customer: Customer): Promise<string> {
    const payload: TokenPayload = { sub: customer.id };

    return this.jwtService.signAsync(payload);
  }

  async decodeUserToken(token: string): Promise<RequestPayload | null> {
    const payload: TokenPayload | null = await this.jwtService
      .verifyAsync(token)
      .catch(() => null);

    if (!payload) {
      return null;
    }

    const customer = await this.usersService.findUsersById(payload.sub);
    return customer ? { customer } : null;
  }

  async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Customer | null> {
    const [customer] = await this.usersService.findBy({ email });

    if (!customer) {
      return null;
    }

    const isValid = await this.validatePassword(password, customer.password);
    return isValid ? customer : null;
  }
}
