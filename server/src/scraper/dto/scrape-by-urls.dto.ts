import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ScrapeByUrlsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  urls: string[];
}
