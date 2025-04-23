import { Test, TestingModule } from '@nestjs/testing';
import { MisMatchAlertController } from './mis-match-alert.controller';

describe('MisMatchAlertController', () => {
  let controller: MisMatchAlertController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MisMatchAlertController],
    }).compile();

    controller = module.get<MisMatchAlertController>(MisMatchAlertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
