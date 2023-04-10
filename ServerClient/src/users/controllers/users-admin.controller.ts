import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import { Role, RoleNames, User } from '../../typeorm/user.entity';
import { RoleByNamePipe } from '../pipes/role-by-name/role-by-name.pipe';
import { UserByIdPipe } from '../pipes/user-by-id/user-by-id.pipe';

@Controller('users-role-manager')
@ApiTags('UsersRoleManager')
export class UsersAdminController {
  constructor(private manager: EntityManager) {}

  @Post('roles/:userId/:roleName')
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'roleName', type: String, enum: RoleNames })
  @ApiResponse({
    status: 200,
    description: 'Role has been successfully added.',
    type: [User],
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Role already exists.',
  })
  async addRole(
    @Param('userId', UserByIdPipe) user: User,
    @Param('roleName', RoleByNamePipe) role: Role,
  ) {
    if (user.roles.find((r) => r.name === role.name)) {
      throw new BadRequestException('Role already exists.');
    }

    if (!user.roles.find((r) => r.name === role.name)) {
      user.roles.push(role);

      await this.manager.save(user);
    }

    return user;
  }

  @Delete('roles/:userId/:roleName')
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'roleName', type: String, enum: RoleNames })
  @ApiResponse({
    status: 200,
    description: 'Role has been deleted sucessfuly.',
    type: [User],
  })
  @ApiResponse({
    status: 400,
    description: 'Role already exists.',
  })
  async removeRole(
    @Param('userId', UserByIdPipe) user: User,
    @Param('roleName', RoleByNamePipe) role: Role,
  ) {
    user.roles = user.roles.filter((r) => r.name !== role.name);

    await this.manager.save(user);

    return user;
  }
}
