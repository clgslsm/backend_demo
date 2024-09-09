import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { UserInteractService } from './user-interact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/shared/roles.enum';

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
}
