import { Test, TestingModule } from '@nestjs/testing';
import { UserMediaController } from './user-media.controller';
import { UserMediaService } from './user-media.service';

describe('UserMediaController', () => {
  let controller: UserMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserMediaController],
      providers: [UserMediaService],
    }).compile();

    controller = module.get<UserMediaController>(UserMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
