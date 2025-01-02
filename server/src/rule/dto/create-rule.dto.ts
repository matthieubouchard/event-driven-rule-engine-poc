import { Type } from 'class-transformer'
import {
  IsString,
  MinLength,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsBoolean,
} from 'class-validator'
import { RuleActionType, RuleType } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
// import { RuleConditionFact, FamilyStatus } from '../../../../shared'

// export enum RuleConditionFact {
//   FAMILY_STATUS = 'familyStatus',
//   IS_BUSINESS_OWNER = 'isBusinessOwner',
//   FILED_2021 = 'filedUsTaxes2021',
// }
export enum RuleConditionFact {
  FAMILY_STATUS = 'familyStatus',
  IS_BUSINESS_OWNER = 'isBusinessOwner',
  FILED_2021 = 'filedUsTaxes2021',
}

export enum FamilyStatusEnum {
  NEW = 'NEW',
  RETURNING = 'RETURNING',
}

export class RuleCondition {
  @ApiProperty({
    enum: RuleConditionFact,
    description: 'The type of condition',
    enumName: 'RuleConditionFact',
  })
  @IsEnum(RuleConditionFact)
  value: RuleConditionFact
}
// export class FamilyStatus {
//   @ApiProperty({
//     enum: FamilyStatusEnum,
//     description: 'New or Returning',
//     enumName: 'FamilyStatusEnum', // Changed to match the actual enum name
//   })
//   @IsEnum(FamilyStatusEnum)
//   value: FamilyStatusEnum
// }

export class FamilyStatusCondition {
  @ApiProperty({
    enum: [RuleConditionFact.FAMILY_STATUS],
    enumName: 'FamilyStatusFact',
  })
  @IsEnum(RuleConditionFact)
  fact: RuleConditionFact.FAMILY_STATUS

  @ApiProperty({
    enum: FamilyStatusEnum,
    enumName: 'FamilyStatusEnum',
  })
  @IsEnum(FamilyStatusEnum)
  value: FamilyStatusEnum
}

export class BusinessOwnerCondition {
  @ApiProperty({
    enum: [RuleConditionFact.IS_BUSINESS_OWNER],
    enumName: 'BusinessOwnerFact',
  })
  @IsEnum(RuleConditionFact)
  fact: RuleConditionFact.IS_BUSINESS_OWNER

  @ApiProperty()
  @IsBoolean()
  value: boolean
}

export class Filed2021Condition {
  @ApiProperty({
    enum: [RuleConditionFact.FILED_2021],
    enumName: 'Filed2021Fact',
  })
  @IsEnum(RuleConditionFact)
  fact: RuleConditionFact.FILED_2021

  @ApiProperty()
  @IsBoolean()
  value: boolean
}

export class Action {
  @ApiProperty({
    enum: RuleActionType,
    default: RuleActionType.DOCUMENT_REQUEST,
  })
  @IsEnum(RuleActionType)
  type: RuleActionType

  @ApiProperty()
  @IsString()
  value: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string
}

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
  @IsEnum(RuleType)
  type: RuleType

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
        mapping: {
          [RuleConditionFact.FAMILY_STATUS]:
            '#/components/schemas/FamilyStatusCondition',
          [RuleConditionFact.IS_BUSINESS_OWNER]:
            '#/components/schemas/BusinessOwnerCondition',
          [RuleConditionFact.FILED_2021]:
            '#/components/schemas/Filed2021Condition',
        },
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
  conditions: (
    | FamilyStatusCondition
    | BusinessOwnerCondition
    | Filed2021Condition
  )[]

  @ApiProperty({ type: [Action] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one action is required' })
  @ValidateNested({ each: true })
  @Type(() => Action)
  actions: Action[]
}
