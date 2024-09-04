import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CrawlType } from '../entities/user-media.entity';

export class UserMediaDto {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  crawl_string: string;

  @IsNotEmpty()
  crawl_type: CrawlType;
}

export class CreateUserMediaBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserMediaDto)
  user_media: UserMediaDto[];
}
