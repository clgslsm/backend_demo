import { Test, TestingModule } from '@nestjs/testing';
import { UserInteractController } from './user-interact.controller';

describe('UserInteractController', () => {
  let controller: UserInteractController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInteractController],
    }).compile();

    controller = module.get<UserInteractController>(UserInteractController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
