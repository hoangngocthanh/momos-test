import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMedia } from './entities/user-media.entity';
import { UserMediaController } from './user-media.controller';
import { UserMediaService } from './user-media.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserMedia])],
  controllers: [UserMediaController],
  providers: [UserMediaService],
  exports: [UserMediaService],
})
export class UserMediaModule {}
