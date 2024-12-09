import { Prisma } from '@prisma/client'
import * as fs from 'fs'

const dtoTemplate = (modelName: string, fields: any[]) => `
import { ApiProperty } from '@nestjs/swagger';

export class ${modelName}Dto {
  ${fields
    .map((f) => `@ApiProperty()\n  ${f.name}: ${f.type.toLowerCase()};`)
    .join('\n  ')}
}
`

const { models } = Prisma.dmmf.datamodel
models.forEach((model) => {
  const fields = [...model.fields]
  fs.writeFileSync(
    `src/dto/${model.name.toLowerCase()}.dto.ts`,
    dtoTemplate(model.name, fields),
  )
})
