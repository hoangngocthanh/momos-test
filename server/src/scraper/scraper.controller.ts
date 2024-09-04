import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GlobalGuard, RequestWithUser } from 'src/guards/global.guard';
import { ScrapeByKeywordDto } from './dto/scrape-by-keyword.dto';
import { ScrapeByUrlsDto } from './dto/scrape-by-urls.dto';
import { ScraperService } from './scraper.service';

@ApiBearerAuth('access-token')
@Controller('scraper')
@UseGuards(GlobalGuard)
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('keyword')
  scrapeByKeyword(
    @Req() request: RequestWithUser,
    @Body() scrapeByKeywordDto: ScrapeByKeywordDto,
  ) {
    const user = request['user'];
    return this.scraperService.scrapeByKeyword({
      ...scrapeByKeywordDto,
      user_id: user.userId,
    });
  }

  @Post('urls')
  scrapeByUrls(
    @Req() request: RequestWithUser,
    @Body() scrapeByUrlsDto: ScrapeByUrlsDto,
  ) {
    const user = request['user'];
    return this.scraperService.scrapeByUrls({
      ...scrapeByUrlsDto,
      user_id: user.userId,
    });
  }
}
