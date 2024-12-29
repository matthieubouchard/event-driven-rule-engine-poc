// create-rule.dto.ts

import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
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
import { FamilyStatus, RuleActionType, RuleType } from '@prisma/client'

export enum CONDITIONS {
  FAMILY_STATUS = 'familyStatus',
  IS_BUSINESS_OWNER = 'isBusinessOwner',
  FILED_2021 = 'filedUsTaxes2021',
}

export class FamilyStatusCondition {
  @ApiProperty({
    enum: [CONDITIONS.FAMILY_STATUS],
    enumName: 'FamilyStatusFact',
  })
  @IsEnum(CONDITIONS)
  fact: CONDITIONS.FAMILY_STATUS

  @ApiProperty({ enum: FamilyStatus })
  @IsEnum(FamilyStatus)
  value: FamilyStatus
}

export class BusinessOwnerCondition {
  @ApiProperty({
    enum: [CONDITIONS.IS_BUSINESS_OWNER],
    enumName: 'BusinessOwnerFact',
  })
  @IsEnum(CONDITIONS)
  fact: CONDITIONS.IS_BUSINESS_OWNER

  @ApiProperty()
  @IsBoolean()
  value: boolean
}

export class Filed2021Condition {
  @ApiProperty({ enum: [CONDITIONS.FILED_2021], enumName: 'Filed2021Fact' })
  @IsEnum(CONDITIONS)
  fact: CONDITIONS.FILED_2021

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
          [CONDITIONS.FAMILY_STATUS]:
            '#/components/schemas/FamilyStatusCondition',
          [CONDITIONS.IS_BUSINESS_OWNER]:
            '#/components/schemas/BusinessOwnerCondition',
          [CONDITIONS.FILED_2021]: '#/components/schemas/Filed2021Condition',
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
        { value: FamilyStatusCondition, name: CONDITIONS.FAMILY_STATUS },
        { value: BusinessOwnerCondition, name: CONDITIONS.IS_BUSINESS_OWNER },
        { value: Filed2021Condition, name: CONDITIONS.FILED_2021 },
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
