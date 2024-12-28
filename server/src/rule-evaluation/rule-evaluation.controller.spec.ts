import { Test, TestingModule } from '@nestjs/testing';
import { RuleEvaluationController } from './rule-evaluation.controller';
import { RuleEvaluationService } from './rule-evaluation.service';

describe('RuleEvaluationController', () => {
  let controller: RuleEvaluationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuleEvaluationController],
      providers: [RuleEvaluationService],
    }).compile();

    controller = module.get<RuleEvaluationController>(RuleEvaluationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
