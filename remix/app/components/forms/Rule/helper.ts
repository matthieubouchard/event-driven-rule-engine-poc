import {z} from "zod";
import {map} from "lodash";
import {parseWithZod} from "@conform-to/zod";
import {RuleConditionFact, FamilyStatusEnum} from "@server/src/api_docs/api";

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

  // this is a janky workaround because zod is not coercing or preprocessing values
  if (result.payload) {
    // Transform the conditions after validation
    result.payload.conditions = map(
      result.payload.conditions,
      (condition: {
        fact: RuleConditionFact;
        value: string | boolean | FamilyStatusEnum;
      }) => {
        if (condition.fact === RuleConditionFact.FamilyStatus) {
          return condition;
        }
        return {
          ...condition,
          value: condition.value === "true",
        };
      }
    );
  }
  return result;
};
