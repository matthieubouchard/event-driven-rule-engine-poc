import { Module } from '@nestjs/common'
import { RuleEvaluationController } from './rule-evaluation.controller'
import { RuleEvaluationService } from './rule-evaluation.service'
import { PubSubModule } from 'src/pubsub/pubsub.module'

@Module({
  controllers: [RuleEvaluationController],
  providers: [RuleEvaluationService],
  imports: [PubSubModule],
})
export class RuleEvaluationModule {}
