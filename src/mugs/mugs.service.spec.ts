import { Test, TestingModule } from '@nestjs/testing';
import { MugsService } from './mugs.service';

describe('MugsService', () => {
  let service: MugsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MugsService],
    }).compile();

    service = module.get<MugsService>(MugsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
