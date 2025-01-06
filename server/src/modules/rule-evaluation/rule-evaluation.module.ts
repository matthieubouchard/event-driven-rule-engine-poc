import { Module } from '@nestjs/common'

import { PubSubModule } from 'src/modules/pubsub/pubsub.module'

import { RuleEvaluationController } from './rule-evaluation.controller'
import { RuleEvaluationService } from './rule-evaluation.service'

@Module({
  controllers: [RuleEvaluationController],
  providers: [RuleEvaluationService],
  imports: [PubSubModule],
})
export class RuleEvaluationModule {}
