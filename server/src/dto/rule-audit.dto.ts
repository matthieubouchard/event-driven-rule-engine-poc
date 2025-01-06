import { ApiProperty } from '@nestjs/swagger'

import { RuleVersionName } from './rule-version.dto'

export class RuleAuditDto {
  @ApiProperty({ type: RuleVersionName })
  ruleVersion: RuleVersionName

  @ApiProperty()
  matched: boolean

  @ApiProperty()
  id: string

  @ApiProperty()
  evaluatedAt: Date
}
