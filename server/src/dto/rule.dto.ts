import { ApiProperty, ApiExtraModels } from '@nestjs/swagger'
import {
  IsString,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  MinLength,
  IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'
import { RuleType } from '@prisma/client'

import { RuleVersionDto } from './rule-version.dto'
import { Action } from './rule-action.dto'
import {
  RuleConditionDto,
  RuleConditionFact,
  FamilyStatusCondition,
  BusinessOwnerCondition,
  Filed2021Condition,
} from './rule-condition.dto'

@ApiExtraModels(
  FamilyStatusCondition,
  Filed2021Condition,
  BusinessOwnerCondition,
)
export class RuleDto {
  @ApiProperty()
  id: string

  @ApiProperty({ required: false })
  active?: boolean

  @ApiProperty({ type: [RuleVersionDto] })
  versions: RuleVersionDto[]
}

@ApiExtraModels(
  FamilyStatusCondition,
  BusinessOwnerCondition,
  Filed2021Condition,
  Action,
)
export class CreateRuleDto {
  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'Min length is 3' })
  name: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty({
    enum: RuleType,
    default: RuleType.APPLICATION,
  })
  @IsOptional()
  @IsEnum(RuleType)
  type?: RuleType

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: '#/components/schemas/FamilyStatusCondition' },
        { $ref: '#/components/schemas/BusinessOwnerCondition' },
        { $ref: '#/components/schemas/Filed2021Condition' },
      ],
      discriminator: {
        propertyName: 'fact',
      },
    },
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one condition is required' })
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'fact',
      subTypes: [
        { value: FamilyStatusCondition, name: RuleConditionFact.FAMILY_STATUS },
        {
          value: BusinessOwnerCondition,
          name: RuleConditionFact.IS_BUSINESS_OWNER,
        },
        { value: Filed2021Condition, name: RuleConditionFact.FILED_2021 },
      ],
    },
  })
  conditions: RuleConditionDto[]

  @ApiProperty({ type: [Action] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one action is required' })
  @ValidateNested({ each: true })
  @Type(() => Action)
  actions: Action[]
}
