import { Module } from '@nestjs/common';
import { QueueModule } from 'src/queue/queue.module';
import { UserMediaModule } from 'src/user-media/user-media.module';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';

@Module({
  imports: [QueueModule, UserMediaModule],
  controllers: [ScraperController],
  providers: [ScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}
