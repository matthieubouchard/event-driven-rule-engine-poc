import { Body, Controller, Logger, Post } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { PubSubService } from 'src/pubsub/pubsub.service'
import { map } from 'lodash'
import { RuleEvaluationService } from './rule-evaluation.service'
import { KAFKA_TOPICS } from 'src/pubsub/config'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { RuleConditionDto, RuleConditionsInput } from 'src/dto'

@Controller()
export class RuleEvaluationController {
  constructor(
    private readonly ruleEvalService: RuleEvaluationService,
    private readonly pubSubService: PubSubService,
  ) {}

  @Post('preview-count')
  @ApiOperation({
    summary: 'Get count of applications matching rule conditions',
  })
  @ApiBody({
    type: RuleConditionsInput,
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
        },
      },
    },
  })
  async getMatchingApplicationsCount(
    @Body() conditions: RuleConditionDto[],
  ): Promise<{ count: number }> {
    return {
      count: await this.ruleEvalService.countMatchingApplications(conditions),
    }
  }

  @EventPattern(KAFKA_TOPICS.APPLICATION_SUBMITTED.name)
  async handleApplication(@Payload() message: any) {
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
