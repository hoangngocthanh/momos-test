import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import puppeteer from 'puppeteer-core';
import { MediaType } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';

@Processor('media-crawler', {
  concurrency: 1,
  removeOnComplete: {},
})
export class QueueProcessor extends WorkerHost {
  constructor(private mediaService: MediaService) {
    super();
  }

  async scrapeSingleUrl(url: string, userMediaId: string) {
    console.log({
      url,
      userMediaId,
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

    const page = await browser.newPage();
    await page.setRequestInterception(true);

    const excludedResourceTypes = [
      'stylesheet',
      'image',
      'font',
      'media',
      'other',
      'xhr',
      'manifest',
    ];
    page.on('request', (interceptedRequest) => {
      if (excludedResourceTypes.includes(interceptedRequest.resourceType())) {
        interceptedRequest.abort();
      } else {
        interceptedRequest.continue();
      }
    });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

    const pageMedia = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
        .filter(
          (image) =>
            image.src &&
            (image.src.endsWith('png') ||
              image.src.endsWith('jpg') ||
              image.src.endsWith('jpeg') ||
              image.src.endsWith('webp')) &&
            !image.src.startsWith('blob'),
        )
        .map((image) => ({
          type: 'image',
          url: image.src,
        }));
      const videos = Array.from(document.querySelectorAll('video'))
        .filter((video) => video.src && !video.src.startsWith('blob'))
        .map((video) => ({
          type: 'video',
          url: video.src,
        }));

      return [...images, ...videos];
    });
    await page.close();

    if (pageMedia.length === 0) {
      return false;
    }

    await this.mediaService.createBulkMedia({
      media: pageMedia.map((pageMediaItem) => ({
        user_media_id: userMediaId,
        type: pageMediaItem.type as MediaType,
        url: pageMediaItem.url,
      })),
    });
    return true;
  }

  async process(job: Job<any, any, string>): Promise<any> {
    Logger.debug(
      `id=${job.id}-${job.data.url}-${job.data.userMediaId}, timestamp=${job.timestamp}`,
    );
    try {
      await this.scrapeSingleUrl(job.data.url, job.data.userMediaId);
    } catch (error) {
      console.log(error);
    }
  }
}
