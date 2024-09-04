import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { MediaType } from '../entities/media.entity';

export class MediaItemDto {
  @IsNotEmpty()
  @IsString()
  user_media_id: string;

  @IsNotEmpty()
  type: MediaType;

  @IsNotEmpty()
  url: string;
}

export class CreateMediaBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  media: MediaItemDto[];
}
