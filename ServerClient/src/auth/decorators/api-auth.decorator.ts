import { RoleNames } from 'src/typeorm/user.entity';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../users/decorators/roles.decorator';

export const ApiAuth = (...roles: RoleNames[]) =>
  applyDecorators(UseGuards(JwtAuthGuard), Roles(...roles), ApiBearerAuth());
