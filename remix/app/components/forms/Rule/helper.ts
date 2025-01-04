import {z} from "zod";
import {RuleConditionFact, FamilyStatusEnum} from "@server/src/api_docs/api";
import {parseWithZod} from "@conform-to/zod";

const conditionSchema = z.discriminatedUnion("fact", [
  z.object({
    fact: z.literal(RuleConditionFact.FamilyStatus),
    value: z.nativeEnum(FamilyStatusEnum),
  }),
  z.object({
    fact: z.literal(RuleConditionFact.IsBusinessOwner),
    value: z.coerce.boolean(),
  }),
  z.object({
    fact: z.literal(RuleConditionFact.FiledUsTaxes2021),
    value: z.coerce.boolean(),
  }),
]);
export const formSchema = z.object({
  name: z.string().min(3, "Min length is 3"),
  description: z.string(),
  conditions: z
    .array(conditionSchema)
    .min(1, "At least one condition is required"),
  actions: z
    .array(
      z.object({
        type: z.string().default("DOCUMENT_REQUEST"),
        value: z.string(),
        description: z.string().optional(),
      })
    )
    .min(1, "At least one action is required"),
});

export const transformAndValidateFormData = (formData: FormData) => {
  const result = parseWithZod(formData, {
    schema: formSchema,
  });
  console.log("initial resultl", result);

  if (result.payload) {
    // Transform the conditions after validation
    // eslint-disable-next
    result.payload.conditions = result.payload.conditions.map(
      (condition: {
        fact: RuleConditionFact;
        value: string | boolean | FamilyStatusEnum;
      }) => {
        if (condition.fact === RuleConditionFact.FamilyStatus) {
          return condition;
        }
        // this is a workaround because zod is not coercing 'true'/'false' to booleans
        return {
          ...condition,
          value: condition.value === "true",
        };
      }
    );
  }
  console.log("Transformed result:", result);
  return result;
};
