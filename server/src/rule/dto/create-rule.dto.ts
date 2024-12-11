import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator'
import { Type } from 'class-transformer'
import {
  RuleType,
  RuleActionType,
  DocumentType,
  FamilyStatus,
} from '@prisma/client'

class RuleConditionDto {
  @IsString()
  type: string

  @IsNotEmpty()
  value: FamilyStatus | boolean
}

class RuleActionDto {
  @IsEnum(RuleActionType)
  type: RuleActionType

  @IsEnum(DocumentType)
  documentType: DocumentType

  @IsString()
  description: string
}

export class CreateRuleDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsBoolean()
  @IsOptional()
  active?: boolean = true

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleConditionDto)
  conditions: RuleConditionDto[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuleActionDto)
  actions: RuleActionDto[]

  @IsOptional()
  @IsEnum(RuleType)
  type: RuleType = RuleType.APPLICATION
}
