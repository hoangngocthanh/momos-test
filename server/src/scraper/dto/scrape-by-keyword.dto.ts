import { IsNotEmpty, IsString } from 'class-validator';

export class ScrapeByKeywordDto {
  @IsNotEmpty()
  @IsString()
  keyword: string;
}
