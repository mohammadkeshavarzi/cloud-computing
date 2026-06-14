import { Test, TestingModule } from '@nestjs/testing';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';

describe('TransportController', () => {
  let transportController: TransportController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransportController],
      providers: [TransportService],
    }).compile();

    transportController = app.get<TransportController>(TransportController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(transportController.getHello()).toBe('Hello World!');
    });
  });
});
