import {useQuery} from "@tanstack/react-query";
import {useDebounceValue} from "usehooks-ts";
import {map} from "lodash";
import {apiClient} from "../../apiClient";
import {
  RuleConditionFact,
  FamilyStatusEnum,
  RuleConditionsInput,
} from "@server/src/api_docs/api";

export function useMatchingApplications(conditions: RuleConditionsInput) {
  const [_input] = useDebounceValue(conditions, 1000);
  const input = map(
    _input,
    (condition: {fact: RuleConditionFact; value: string | boolean}) => {
      if (condition.fact === RuleConditionFact.FamilyStatus) {
        if (
          condition.value !== String(FamilyStatusEnum.NEW) &&
          condition.value !== String(FamilyStatusEnum.RETURNING)
        ) {
          return {...condition, value: FamilyStatusEnum.NEW};
        }
        return condition;
      }
      // this is a workaround because zod is not coercing 'true'/'false' to booleans
      return {
        ...condition,
        value: condition.value === "true" || condition.value === true,
      };
    }
  );
  return useQuery({
    queryKey: ["matchingApplications", input],
    queryFn: async () => {
      if (!input) return {count: 0};
      const {data} =
        await apiClient.ruleEvaluationControllerGetMatchingApplicationsCount(
          input as unknown as RuleConditionsInput
        );
      return data;
    },
    enabled: input.length > 0,
    staleTime: 1000,
  });
}
