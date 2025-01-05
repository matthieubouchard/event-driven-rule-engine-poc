import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger'
import { IsEnum, IsBoolean } from 'class-validator'
import { Transform } from 'class-transformer'

export enum RuleConditionFact {
  FAMILY_STATUS = 'familyStatus',
  IS_BUSINESS_OWNER = 'isBusinessOwner',
  FILED_2021 = 'filedUsTaxes2021',
}

export enum FamilyStatusEnum {
  NEW = 'NEW',
  RETURNING = 'RETURNING',
}

// Base class for all conditions
export class BaseCondition {
  @ApiProperty({
    enum: RuleConditionFact,
    description: 'The type of condition',
    enumName: 'RuleConditionFact',
  })
  @IsEnum(RuleConditionFact)
  fact: RuleConditionFact
}

export class FamilyStatusCondition {
  @ApiProperty({
    enum: RuleConditionFact,
    enumName: 'RuleConditionFact',
  })
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
    enum: RuleConditionFact,
    enumName: 'RuleConditionFact',
  })
  fact: RuleConditionFact.IS_BUSINESS_OWNER

  @ApiProperty()
  @Transform(
    ({ value }) => (typeof value === 'string' ? value === 'true' : value), // removed comma here
  )
  @IsBoolean()
  value: boolean
}

export class Filed2021Condition {
  @ApiProperty({
    enum: RuleConditionFact,
    enumName: 'RuleConditionFact',
  })
  fact: RuleConditionFact.FILED_2021

  @ApiProperty()
  @Transform(
    ({ value }) => (typeof value === 'string' ? value === 'true' : value), // removed comma here
  )
  @IsBoolean()
  value: boolean
}

export type RuleConditionDto =
  | FamilyStatusCondition
  | BusinessOwnerCondition
  | Filed2021Condition

@ApiExtraModels(
  FamilyStatusCondition,
  BusinessOwnerCondition,
  Filed2021Condition,
)
export class RuleConditionsInput {
  @ApiProperty({
    isArray: true,
    type: 'array',
    items: {
      type: 'object',
      oneOf: [
        { $ref: getSchemaPath(FamilyStatusCondition) },
        { $ref: getSchemaPath(BusinessOwnerCondition) },
        { $ref: getSchemaPath(Filed2021Condition) },
      ],
      discriminator: {
        propertyName: 'fact',
        mapping: {
          [RuleConditionFact.FAMILY_STATUS]: getSchemaPath(
            FamilyStatusCondition,
          ),
          [RuleConditionFact.IS_BUSINESS_OWNER]: getSchemaPath(
            BusinessOwnerCondition,
          ),
          [RuleConditionFact.FILED_2021]: getSchemaPath(Filed2021Condition),
        },
      },
    },
  })
  conditions: RuleConditionDto[]
}
