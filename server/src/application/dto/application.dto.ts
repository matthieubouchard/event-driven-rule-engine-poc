import { ApiProperty } from '@nestjs/swagger'
import { FamilyStatus } from '@prisma/client'

export class StudentDto {
  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  dob: Date
}

export class RuleVersionDto {
  @ApiProperty({ type: Number })
  version: number

  @ApiProperty({ type: String })
  name: string
}

export class RuleAuditDto {
  @ApiProperty({ type: RuleVersionDto })
  ruleVersion: RuleVersionDto

  @ApiProperty()
  matched: boolean

  @ApiProperty()
  id: string

  @ApiProperty()
  evaluatedAt: Date
}

export class ApplicationResponseDto {
  @ApiProperty({ enum: FamilyStatus })
  familyStatus: FamilyStatus

  @ApiProperty()
  id: string

  @ApiProperty()
  isBusinessOwner: boolean

  @ApiProperty()
  filedUsTaxes2021: boolean

  @ApiProperty()
  student: StudentDto

  @ApiProperty({ type: [RuleAuditDto] })
  ruleAudits: RuleAuditDto[]
}

export class GenericMutationResponse {
  @ApiProperty()
  message: string

  @ApiProperty()
  success: boolean
}
