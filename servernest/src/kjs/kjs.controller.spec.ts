import { Test, TestingModule } from '@nestjs/testing';
import { KjsController } from './kjs.controller';

describe('KjsController', () => {
  let controller: KjsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KjsController],
    }).compile();

    controller = module.get<KjsController>(KjsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
