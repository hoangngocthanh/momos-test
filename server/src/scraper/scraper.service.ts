import { Injectable } from '@nestjs/common';
import BPromise from 'bluebird';
import puppeteer from 'puppeteer-core';
import { WithUserId } from 'src/guards/global.guard';
import { QueueService } from 'src/queue/queue.service';
import { CrawlType } from 'src/user-media/entities/user-media.entity';
import { UserMediaService } from 'src/user-media/user-media.service';
import { CustomErrorException } from 'utils/api-error';
import { CustomResponse } from 'utils/api-response';
import { ScrapeByKeywordDto } from './dto/scrape-by-keyword.dto';
import { ScrapeByUrlsDto } from './dto/scrape-by-urls.dto';

@Injectable()
export class ScraperService {
  constructor(
    private queueService: QueueService,
    private userMediaService: UserMediaService,
  ) {}

  async scrapeByKeyword(scrapeByKeywordParams: WithUserId<ScrapeByKeywordDto>) {
    try {
      const { keyword } = scrapeByKeywordParams;

      const newUserMedia = await this.userMediaService.createUserMedia({
        user_id: scrapeByKeywordParams.user_id,
        crawl_type: CrawlType.KEYWORD,
        crawl_string: scrapeByKeywordParams.keyword,
      });

      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-dev-shm-usage',
          '--no-zygote',
          // '--single-process', // Use a single process for the browser
          '--disable-background-networking', // Disable background networking
          '--disable-background-timer-throttling', // Disable background timer throttling
          '--disable-backgrounding-occluded-windows', // Disable backgrounding occluded windows
          '--disable-client-side-phishing-detection', // Disable phishing detection
          '--disable-default-apps', // Disable default apps
          '--disable-features=TranslateUI', // Disable UI translation features
        ],
      });

      const pageUrls = [];

      for (let i = 0; i < 2; i++) {
        const pageNumber = i + 1;
        const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${pageNumber * 10}`;
        pageUrls.push(url);
      }

      const extractLinksFromPage = async (url) => {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

        const pageLinks = await page.evaluate(() => {
          const h3Titles = Array.from(document.querySelectorAll('h3'));
          const anchorLinks = h3Titles
            .map((h3) => {
              const anchor = h3.closest('a');
              return anchor ? anchor.href : null;
            })
            .filter((href) => href !== null);
          return anchorLinks;
        });
        console.log('pageLinks: ', pageLinks.length);
        await page.close();
        await this.queueService.addBulkUrlJob(
          pageLinks.map((url) => ({ url, userMediaId: newUserMedia.id })),
        );
        return pageLinks;
      };

      await BPromise.map(pageUrls, (url) => extractLinksFromPage(url).catch(), {
        concurrency: 5,
      });

      await browser.close();

      return new CustomResponse(true, {}, '', 200);
    } catch (error) {
      console.error('scrape error', error);
      if (error instanceof CustomErrorException) {
        throw error;
      }
      throw new CustomErrorException('', 500);
    }
  }

  async scrapeByUrls(scrapeByUrlParams: WithUserId<ScrapeByUrlsDto>) {
    const createdUserMediaItems =
      await this.userMediaService.createBulkUserMedia({
        user_media: scrapeByUrlParams.urls.map((url) => ({
          crawl_type: CrawlType.URL,
          crawl_string: url,
          user_id: scrapeByUrlParams.user_id,
        })),
      });
    await this.queueService.addBulkUrlJob(
      scrapeByUrlParams.urls.map((url) => {
        const targetUserMedia = createdUserMediaItems.find(
          (createdUserMediaItem) => createdUserMediaItem.crawl_string === url,
        );
        return {
          url,
          userMediaId: targetUserMedia.id,
        };
      }),
    );

    return new CustomResponse(true, {}, '', 200);
  }
}
