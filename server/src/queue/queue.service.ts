import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('media-crawler') private readonly urlQueue: Queue) {}

  async addUrlJob(url: string) {
    await this.urlQueue.add('media-crawler', { url });
  }

  async addBulkUrlJob(
    addBulkUrlJobParams: {
      userMediaId: string;
      url;
    }[],
  ) {
    await this.urlQueue.addBulk(
      addBulkUrlJobParams.map((addBulkUrlJobParamItem) => ({
        name: 'media-crawler',
        data: addBulkUrlJobParamItem,
      })),
    );
  }

  async drainUrlJob() {
    await this.urlQueue.drain();
  }
}
