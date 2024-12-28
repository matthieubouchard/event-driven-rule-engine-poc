import { Test, TestingModule } from '@nestjs/testing';
import { RuleEvaluationService } from './rule-evaluation.service';

describe('RuleEvaluationService', () => {
  let service: RuleEvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuleEvaluationService],
    }).compile();

    service = module.get<RuleEvaluationService>(RuleEvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
