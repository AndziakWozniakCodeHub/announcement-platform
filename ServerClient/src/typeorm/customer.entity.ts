import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contract } from './contract.entity';

export enum RoleNames {
  ADMIN = 'admin',
  ROOT = 'root',
}

@Entity()
export class Role {
  constructor(data: Partial<Role> = {}) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: RoleNames;

  @ManyToMany(() => Customer)
  customers: Customer[];
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  @ApiProperty({ example: 1 })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  @ApiProperty({ example: 'Media Expert' })
  customer_name: string;

  @Column({
    name: 'email_address',
    nullable: false,
    default: '',
  })
  @ApiProperty({ example: 'info@mediaexpert.pl' })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  @ApiProperty({ example: '!@#$' })
  password: string;

  @ManyToMany(() => Role, (role) => role.customers, { eager: true })
  @JoinTable({ name: 'customer_roles' })
  roles: Role[];

  @ManyToMany(() => Contract, (contract) => contract.contract_id, {
    eager: true,
  })
  @JoinTable({ name: 'customer_contracts' })
  contracts: Contract[];
}

export class TokenPayload {
  sub: number;
}

export class RequestPayload {
  customer: Customer;
}

export class ExceptionResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: 'Username or Email already exist in the database.' })
  message: string;
  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
