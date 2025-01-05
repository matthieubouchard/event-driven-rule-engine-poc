import { ApiProperty } from '@nestjs/swagger'

export class SchoolDto {
  @ApiProperty()
  name: string
}
