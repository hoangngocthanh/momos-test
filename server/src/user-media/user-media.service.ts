import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserMediaBulkDto } from './dto/create-user-media-bulk.dto';
import { CreateUserMediaDto } from './dto/create-user-media.dto';
import { UserMedia } from './entities/user-media.entity';

@Injectable()
export class UserMediaService {
  constructor(
    @InjectRepository(UserMedia)
    private readonly userMediaRepository: Repository<UserMedia>,
  ) {}

  async createUserMedia(
    createUserMediaDto: CreateUserMediaDto,
  ): Promise<UserMedia> {
    const userMedia: UserMedia = new UserMedia();

    userMedia.user_id = createUserMediaDto.user_id;
    userMedia.crawl_type = createUserMediaDto.crawl_type;
    userMedia.crawl_string = createUserMediaDto.crawl_string;

    const newUserMedia = await this.userMediaRepository.save(userMedia);
    return newUserMedia;
  }

  async createBulkUserMedia(
    createUserMediaDto: CreateUserMediaBulkDto,
  ): Promise<UserMedia[]> {
    const userMediaItems: UserMedia[] = createUserMediaDto.user_media.map(
      (userMediaItem) => {
        const newUserMedia = new UserMedia();

        newUserMedia.user_id = userMediaItem.user_id;
        newUserMedia.crawl_type = userMediaItem.crawl_type;
        newUserMedia.crawl_string = userMediaItem.crawl_string;

        return newUserMedia;
      },
    );

    const createdUserMediaItems =
      await this.userMediaRepository.save(userMediaItems);
    return createdUserMediaItems;
  }

  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: UserMedia[]; total: number }> {
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    const offset = (page - 1) * limit;

    const [userMediaItems, total] = await this.userMediaRepository.findAndCount(
      {
        where: { user_id: userId },
        relations: ['media'],
        skip: offset,
        take: limit,
      },
    );

    return { data: userMediaItems, total };
  }
}
