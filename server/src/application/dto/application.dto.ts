import { ApiProperty } from '@nestjs/swagger'
import { DocumentStatus, FamilyStatus } from '@prisma/client'

export class StudentDto {
  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  dob: Date
}
export class SchoolDto {
  @ApiProperty()
  name: string
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
export class DocumentDto {
  @ApiProperty()
  name: string
}

export class DocumentRequestDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  requestedAt: Date

  @ApiProperty()
  updatedAt?: Date

  @ApiProperty({ enum: DocumentStatus })
  status: DocumentStatus

  @ApiProperty({ type: DocumentDto })
  document: DocumentDto
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

  @ApiProperty()
  school: SchoolDto

  @ApiProperty({ type: [RuleAuditDto] })
  ruleAudits: RuleAuditDto[]

  @ApiProperty({ type: [DocumentRequestDto] })
  documentRequests: DocumentRequestDto[]
}

export class GenericMutationResponse {
  @ApiProperty()
  message: string

  @ApiProperty()
  success: boolean
}
