import { Controller } from '@nestjs/common'
import { RuleEvaluationService } from './rule-evaluation.service'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller()
export class RuleEvaluationController {
  constructor(private readonly ruleEvalService: RuleEvaluationService) {}

  @MessagePattern('application.submitted')
  async handleApplication(@Payload() message: any) {
    console.log('Rules controller received!!!:', message)
    const result = await this.ruleEvalService.evaluateApplicationRule(
      message.payload.applicationId,
    )
    console.log('result', result)
  }
}
