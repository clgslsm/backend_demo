import { Test, TestingModule } from '@nestjs/testing';
import { UserInteractService } from './user-interact.service';

describe('UserInteractService', () => {
  let service: UserInteractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInteractService],
    }).compile();

    service = module.get<UserInteractService>(UserInteractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
