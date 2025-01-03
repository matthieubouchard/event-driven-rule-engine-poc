import { Controller } from '@nestjs/common'
import { RuleEvaluationService } from './rule-evaluation.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PubSubService } from 'src/pubsub/pubsub.service'

@Controller()
export class RuleEvaluationController {
  constructor(
    private readonly ruleEvalService: RuleEvaluationService,
    private readonly pubSubService: PubSubService,
  ) {}

  @MessagePattern('application.submitted')
  async handleApplication(@Payload() message: any) {
    console.log('RULE EVAL CONSUMER RECEIVED:', {
      consumerId: 'rule-evaluation',
      message,
    })
    const result = await this.ruleEvalService.evaluateApplicationRules(
      message.payload.applicationId,
    )
    // console.log('result', result)
    if (result.actionableRules.length > 0) {
      for (const trigger of result.actionableRules) {
        console.log('TRIGGER', trigger)
        await this.pubSubService.publish({
          topic: 'document.requested',
          payload: trigger.params,
        })
      }
    }
  }
}
