import { Test, TestingModule } from '@nestjs/testing';
import { PubsubController } from './pubsub.controller';
import { PubsubService } from './pubsub.service';

describe('PubsubController', () => {
  let controller: PubsubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PubsubController],
      providers: [PubsubService],
    }).compile();

    controller = module.get<PubsubController>(PubsubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
