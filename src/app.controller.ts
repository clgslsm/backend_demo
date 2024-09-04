// src/app.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/guards/roles.guard';
import { Role } from './shared/roles.enum';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('resource')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  @Get('admin')
  @Roles(Role.ADMIN)
  getAdminResource() {
    return 'This is an admin resource';
  }

  @Get('user')
  @Roles(Role.USER)
  getUserResource() {
    return 'This is a user resource';
  }
}
