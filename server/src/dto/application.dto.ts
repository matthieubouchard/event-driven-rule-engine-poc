import { ApiProperty } from '@nestjs/swagger'
import { FamilyStatus } from '@prisma/client'
import { StudentDto } from './student.dto'
import { SchoolDto } from './school.dto'
import { RuleAuditDto } from './rule-audit.dto'
import { DocumentRequestDto } from './document.dto'

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

  @ApiProperty()
  school: SchoolDto

  @ApiProperty({ type: [RuleAuditDto] })
  ruleAudits: RuleAuditDto[]

  @ApiProperty({ type: [DocumentRequestDto] })
  documentRequests: DocumentRequestDto[]
}
