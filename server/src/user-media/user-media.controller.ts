import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { GlobalGuard, RequestWithUser } from 'src/guards/global.guard';
import { UserMedia } from './entities/user-media.entity';
import { UserMediaService } from './user-media.service';

@Controller('user-media')
@UseGuards(GlobalGuard)
export class UserMediaController {
  constructor(private readonly userMediaService: UserMediaService) {}

  @Get()
  async getUserMedia(
    @Req() request: RequestWithUser,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: UserMedia[]; total: number }> {
    const user = request['user'];
    return this.userMediaService.findByUserId(user.userId, page, limit);
  }
}
