import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GlobalGuard } from 'src/guards/global.guard';
import { Media } from './entities/media.entity';
import { MediaService } from './media.service';

@Controller('media')
@UseGuards(GlobalGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('')
  async getMedia(
    @Query('userMediaId') userMediaId: string,
  ): Promise<{ data: Media[]; total: number }> {
    return this.mediaService.findMedia({
      userMediaId,
    });
  }
}
