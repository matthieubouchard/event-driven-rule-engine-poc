import { ApiProperty, ApiExtraModels } from '@nestjs/swagger'

import { RuleType } from '@prisma/client'

import { Action } from './rule-action.dto'
import {
  RuleConditionDto,
  FamilyStatusCondition,
  BusinessOwnerCondition,
  Filed2021Condition,
} from './rule-condition.dto'

export class RuleVersionName {
  @ApiProperty()
  version: number

  @ApiProperty()
  name: string
}

@ApiExtraModels(
  FamilyStatusCondition,
  BusinessOwnerCondition,
  Filed2021Condition,
)
export class RuleVersionDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  version: number

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty({ enum: RuleType })
  type: RuleType

  @ApiProperty({
    type: 'object',
    properties: {
      conditions: {
        type: 'array',
        items: {
          oneOf: [
            { $ref: '#/components/schemas/FamilyStatusCondition' },
            { $ref: '#/components/schemas/BusinessOwnerCondition' },
            { $ref: '#/components/schemas/Filed2021Condition' },
          ],
        },
      },
      actions: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Action',
        },
      },
    },
    required: ['conditions', 'actions'],
  })
  ruleJson: {
    conditions: RuleConditionDto[]
    actions: Action[]
  }
}
