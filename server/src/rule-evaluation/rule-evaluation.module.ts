import { Module } from '@nestjs/common'
import { RuleEvaluationController } from './rule-evaluation.controller'
import { RuleEvaluationService } from './rule-evaluation.service'

@Module({
  controllers: [RuleEvaluationController],
  providers: [RuleEvaluationService],
})
export class RuleEvaluationModule {}
