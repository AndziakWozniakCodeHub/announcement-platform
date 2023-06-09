import { SetMetadata } from '@nestjs/common';
import { RoleNames } from 'src/typeorm/user.entity';

export const ROLES_KEY = Symbol('roles');

export const Roles = (...args: RoleNames[]) => SetMetadata(ROLES_KEY, args);
