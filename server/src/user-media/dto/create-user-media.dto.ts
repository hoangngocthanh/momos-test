import { IsNotEmpty } from 'class-validator';
import { CrawlType } from '../entities/user-media.entity';

export class CreateUserMediaDto {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  crawl_string: string;

  @IsNotEmpty()
  crawl_type: CrawlType;
}
