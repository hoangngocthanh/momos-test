import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Media } from './media/entities/media.entity';
import { MediaModule } from './media/media.module';
import { QueueModule } from './queue/queue.module';
import { ScraperModule } from './scraper/scraper.module';
import { UserMedia } from './user-media/entities/user-media.entity';
import { UserMediaModule } from './user-media/user-media.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ScraperModule,
    AuthModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.HASH_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      entities: [User, UserMedia, Media],
      database: 'scraper_db',
      synchronize: true,
      // logging: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MediaModule,
    QueueModule,
    UserMediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
