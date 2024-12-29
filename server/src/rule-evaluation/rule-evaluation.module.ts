import { Module } from '@nestjs/common'
import { RuleEvaluationController } from './rule-evaluation.controller'
import { RuleEvaluationService } from './rule-evaluation.service'
import { createPubSubConfig, PubSubModule } from 'src/pubsub/pubsub.module'
import { ClientsModule } from '@nestjs/microservices'

@Module({
  // imports: [ClientsModule.register([createPubSubConfig('rule-evaluation')])],
  controllers: [RuleEvaluationController],
  providers: [RuleEvaluationService],
  imports: [PubSubModule],
})
export class RuleEvaluationModule {}
