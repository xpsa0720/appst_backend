import { Test, TestingModule } from '@nestjs/testing';
import { AuthRequestController } from './auth-request.controller';
import { AuthRequestService } from './auth-request.service';

describe('AuthRequestController', () => {
  let controller: AuthRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthRequestController],
      providers: [AuthRequestService],
    }).compile();

    controller = module.get<AuthRequestController>(AuthRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
