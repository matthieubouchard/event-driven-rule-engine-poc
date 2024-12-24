import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { RuleEvaluationService } from './rule-evaluation/rule-evaluation.service';

@Module({
  controllers: [RuleController],
  providers: [RuleService, RuleEvaluationService],
})
export class RuleModule {}
