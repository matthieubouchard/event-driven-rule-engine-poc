import { ApiProperty, ApiExtraModels } from '@nestjs/swagger'
import { RuleType } from '@prisma/client'
import {
  FamilyStatusCondition,
  BusinessOwnerCondition,
  Filed2021Condition,
  Action,
} from './create-rule.dto'

@ApiExtraModels(
  FamilyStatusCondition,
  BusinessOwnerCondition,
  Filed2021Condition,
  Action,
)
export class RuleVersion {
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
          type: 'object',
          discriminator: {
            propertyName: 'fact',
          },
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
    conditions: (
      | FamilyStatusCondition
      | BusinessOwnerCondition
      | Filed2021Condition
    )[]
    actions: Action[]
  }
}

@ApiExtraModels(RuleVersion)
export class Rule {
  @ApiProperty()
  id: string

  @ApiProperty({ required: false })
  active?: boolean

  @ApiProperty({ type: [RuleVersion] })
  versions: RuleVersion[]
}
