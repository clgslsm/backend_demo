// require-permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Permission } from 'src/shared/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
