import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaBulkDto } from './dto/create-media-bulk.dto';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async createBulkMedia(
    createBulkMediaDto: CreateMediaBulkDto,
  ): Promise<Media[]> {
    const mediaItems: Media[] = createBulkMediaDto.media.map((mediaItem) => {
      const newMedia = new Media();
      newMedia.type = mediaItem.type;
      newMedia.url = mediaItem.url;
      newMedia.user_media_id = mediaItem.user_media_id;

      return newMedia;
    });

    const createdMediaItems = await this.mediaRepository.save(mediaItems);
    return createdMediaItems;
  }

  async findMedia({
    userMediaId,
  }: {
    userMediaId: string;
  }): Promise<{ data: Media[]; total: number }> {
    const [data, total] = await this.mediaRepository.findAndCountBy({
      user_media_id: userMediaId,
    });
    return { data, total };
  }
}
