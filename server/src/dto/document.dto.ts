import { ApiProperty } from '@nestjs/swagger'

import { DocumentStatus } from '@prisma/client'

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
