import { Test, TestingModule } from '@nestjs/testing';
import { MugsController } from './mugs.controller';
import { MugsService } from './mugs.service';

describe('MugsController', () => {
  let controller: MugsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MugsController],
      providers: [MugsService],
    }).compile();

    controller = module.get<MugsController>(MugsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
