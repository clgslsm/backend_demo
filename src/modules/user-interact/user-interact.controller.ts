import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { UserInteractService } from './user-interact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/roles.decorator';
import { Role } from 'src/shared/roles.enum';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { Permission } from 'src/shared/permissions.enum';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@ApiTags('user-interact')
@Controller('user-interact')
export class UserInteractController {
  constructor(private readonly userInteractService: UserInteractService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER)
  @Post('like/:likedUserId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a user' })
  @ApiResponse({ status: 200, description: 'User liked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user or already liked' })
  async likeUser(
    @Param('likedUserId') likedUserId: number,
    @Request() req,
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    return this.userInteractService.handleLike(userId, likedUserId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.LIKE_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test permissions' })
  @ApiResponse({ status: 200, description: 'Test permissions' })
  @Get('test')
  async test(@Request() req) {
    return req.user;
  }
}
