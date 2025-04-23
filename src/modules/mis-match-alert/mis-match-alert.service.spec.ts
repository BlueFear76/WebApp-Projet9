import { Test, TestingModule } from '@nestjs/testing';
import { MisMatchAlertService } from './mis-match-alert.service';

describe('MisMatchAlertService', () => {
  let service: MisMatchAlertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MisMatchAlertService],
    }).compile();

    service = module.get<MisMatchAlertService>(MisMatchAlertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
