import { ApiProperty } from '@nestjs/swagger'

import { RuleActionType } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsString, IsEnum, IsOptional } from 'class-validator'

export class Action {
  @ApiProperty({
    enum: RuleActionType,
    default: RuleActionType.DOCUMENT_REQUEST,
  })
  @IsEnum(RuleActionType)
  @Transform(({ value }) => value || RuleActionType.DOCUMENT_REQUEST)
  type?: RuleActionType = RuleActionType.DOCUMENT_REQUEST

  @ApiProperty()
  @IsString()
  value: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string
}
