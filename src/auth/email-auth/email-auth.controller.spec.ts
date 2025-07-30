import { Test, TestingModule } from '@nestjs/testing';
import { EmailAuthController } from './email-auth.controller';
import { EmailAuthService } from './email-auth.service';

describe('EmailAuthController', () => {
  let controller: EmailAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailAuthController],
      providers: [EmailAuthService],
    }).compile();

    controller = module.get<EmailAuthController>(EmailAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
