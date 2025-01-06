import { ApiProperty } from '@nestjs/swagger'

export class StudentDto {
  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  dob: Date
}
