import { Controller } from '@nestjs/common'
import { RuleEvaluationService } from './rule-evaluation.service'
import { EventPattern, Payload } from '@nestjs/microservices'
import { PubSubService } from 'src/pubsub/pubsub.service'
import { map } from 'lodash'
import { KAFKA_TOPICS } from 'src/pubsub/config'

@Controller()
export class RuleEvaluationController {
  constructor(
    private readonly ruleEvalService: RuleEvaluationService,
    private readonly pubSubService: PubSubService,
  ) {}

  @EventPattern(KAFKA_TOPICS.APPLICATION_SUBMITTED.name)
  async handleApplication(@Payload() message: any) {
    console.log('RULE EVAL CONSUMER RECEIVED:', {
      consumerId: 'rule-evaluation',
      message,
    })
    const result = await this.ruleEvalService.evaluateApplicationRules(
      message.payload.applicationId,
    )
    if (result.actionableRules.length > 0) {
      await Promise.all(
        map(result.actionableRules, (trigger) =>
          this.pubSubService.publish({
            topic: KAFKA_TOPICS.DOCUMENT_REQUESTED.name,
            payload: trigger.params,
          }),
        ),
      )
    }
  }
}
