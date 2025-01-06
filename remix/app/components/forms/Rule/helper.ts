import { parseWithZod } from '@conform-to/zod'
import { RuleConditionFact, FamilyStatusEnum } from '@server/src/api_docs/api'
import { z } from 'zod'

const conditionSchema = z.discriminatedUnion('fact', [
  z.object({
    fact: z.literal(RuleConditionFact.FamilyStatus),
    value: z.nativeEnum(FamilyStatusEnum),
  }),
  z.object({
    fact: z.literal(RuleConditionFact.IsBusinessOwner),
    value: z.preprocess((val) => String(val).toLowerCase(), z.enum(['true', 'false'])),
  }),
  z.object({
    fact: z.literal(RuleConditionFact.FiledUsTaxes2021),
    value: z.preprocess((val) => String(val).toLowerCase(), z.enum(['true', 'false'])),
  }),
])

export const formSchema = z.object({
  name: z.string().min(3, 'Min length is 3'),
  description: z.string(),
  conditions: z.array(conditionSchema).min(1, 'At least one condition is required'),
  actions: z
    .array(
      z.object({
        type: z.string().default('DOCUMENT_REQUEST'),
        value: z.string(),
        description: z.string().optional(),
      }),
    )
    .min(1, 'At least one action is required'),
})

export const transformAndValidateFormData = (formData: FormData) => {
  const result = parseWithZod(formData, {
    schema: formSchema,
  })
  return result
}
