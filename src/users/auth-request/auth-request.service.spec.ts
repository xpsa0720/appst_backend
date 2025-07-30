import { Test, TestingModule } from '@nestjs/testing';
import { AuthRequestService } from './auth-request.service';

describe('AuthRequestService', () => {
  let service: AuthRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthRequestService],
    }).compile();

    service = module.get<AuthRequestService>(AuthRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
