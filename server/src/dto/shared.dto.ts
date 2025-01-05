import { ApiProperty } from '@nestjs/swagger'

export class GenericMutationResponse {
  @ApiProperty()
  message?: string

  @ApiProperty()
  success?: boolean
}
