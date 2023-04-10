import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import { Role, RoleNames, Customer } from '../../typeorm/customer.entity';
import { RoleByNamePipe } from '../pipes/role-by-name/role-by-name.pipe';
import { CustomerByIdPipe } from '../pipes/customer-by-id/customer-by-id.pipe';

@Controller('customers-role-manager')
@ApiTags('CustomersRoleManager')
export class CustomersAdminController {
  constructor(private manager: EntityManager) {}

  @Post('roles/:userId/:roleName')
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'roleName', type: String, enum: RoleNames })
  @ApiResponse({
    status: 200,
    description: 'Role has been successfully added.',
    type: [Customer],
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Role already exists.',
  })
  async addRole(
    @Param('userId', CustomerByIdPipe) customer: Customer,
    @Param('roleName', RoleByNamePipe) role: Role,
  ) {
    if (customer.roles.find((r) => r.name === role.name)) {
      throw new BadRequestException('Role already exists.');
    }

    if (!customer.roles.find((r) => r.name === role.name)) {
      customer.roles.push(role);

      await this.manager.save(customer);
    }

    return customer;
  }

  @Delete('roles/:userId/:roleName')
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'roleName', type: String, enum: RoleNames })
  @ApiResponse({
    status: 200,
    description: 'Role has been deleted sucessfuly.',
    type: [Customer],
  })
  @ApiResponse({
    status: 400,
    description: 'Role already exists.',
  })
  async removeRole(
    @Param('userId', CustomerByIdPipe) customer: Customer,
    @Param('roleName', RoleByNamePipe) role: Role,
  ) {
    customer.roles = customer.roles.filter((r) => r.name !== role.name);

    await this.manager.save(customer);

    return customer;
  }
}
