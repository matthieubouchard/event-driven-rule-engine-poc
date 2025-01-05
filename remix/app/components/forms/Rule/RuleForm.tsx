import {useEffect} from "react";
import {useForm} from "@conform-to/react";
import {Form, FormMethod, useLoaderData, useNavigate} from "@remix-run/react";
import {json} from "@remix-run/node";
import {
  FamilyStatusCondition,
  BusinessOwnerCondition,
  Filed2021Condition,
  Action,
  RuleConditionFact,
  FamilyStatusEnum,
  RuleConditionsInput,
} from "@server/src/api_docs/api";

import {transformAndValidateFormData} from "./helper";
import {apiClient} from "../../../apiClient";
import {useMatchingApplications} from "~/hooks/api/useMatchingRuleCount";

export interface RuleFormProps {
  initialData?: {
    name: string;
    description?: string;
    conditions: Array<
      FamilyStatusCondition | BusinessOwnerCondition | Filed2021Condition
    >;
    actions: Array<Action>;
  };
  method: FormMethod;
}

export async function loader() {
  const [documentsRes] = await Promise.all([
    apiClient.documentControllerFindAll(),
  ]);

  if (!documentsRes.ok) {
    throw new Response("Documents not found", {status: 404});
  }

  const [documents] = await Promise.all([documentsRes.json()]);
  return json({documents});
}

export default function RuleForm({
  initialData,
  method = "post",
}: RuleFormProps) {
  const {documents} = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [form, fields] = useForm({
    defaultValue: initialData ?? {
      conditions: [
        {
          fact: RuleConditionFact.FamilyStatus,
          value: FamilyStatusEnum.NEW,
        },
      ],
      actions: [
        {
          type: "DOCUMENT_REQUEST",
          value: documents[0].id,
          description: "",
        },
      ],
    },
    shouldRevalidate: "onBlur",
    onValidate({formData}) {
      const result = transformAndValidateFormData(formData);
      return result;
    },
  });
  useEffect(() => {
    if (initialData) {
      // update values for matching results hook
      form.update(initialData);
    }
  }, [initialData]);

  const handleAddCondition = () => {
    form.insert({
      name: fields.conditions.name,
      defaultValue: {
        fact: RuleConditionFact.FamilyStatus,
        value: FamilyStatusEnum.NEW,
      },
    });
  };

  const handleAddAction = () => {
    form.insert({
      name: fields.actions.name,
      defaultValue: {
        type: "DOCUMENT_REQUEST",
        value: documents[0].id,
        description: "",
      },
    });
  };

  const conditions = fields.conditions.getFieldList();
  const actions = fields.actions.getFieldList();
  const currentConditions = (fields?.conditions?.value ??
    []) as unknown as RuleConditionsInput;
  console.log(currentConditions);
  const {data} = useMatchingApplications(currentConditions);
  const count = data?.count ?? 0;

  return (
    <Form id={form.id} onSubmit={form.onSubmit} method={method}>
      <div className="max-w-4xl mx-auto p-4 bg-base-100">
        <div className="flex justify-between items-center mb-6">
          <button type="button" className="btn btn-ghost gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
              />
            </svg>
            Advanced
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/rules")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save and Enable Rule
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="w-[240px]">
            <input
              type="text"
              name="name"
              placeholder="Rule Name"
              className="input input-bordered w-full"
              defaultValue={initialData?.name}
            />
            {!!fields?.name?.errors?.length &&
              fields.name.errors.map((error) => (
                <div key={error} className="text-error text-sm mt-1">
                  {error}
                </div>
              ))}
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="description"
              placeholder="Rule Description (optional)"
              className="input input-bordered w-full"
              defaultValue={initialData?.description}
            />
            {!!fields?.description?.errors?.length &&
              fields.description.errors.map((error) => (
                <div key={error} className="text-error text-sm mt-1">
                  {error}
                </div>
              ))}
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-4">
          <div className="card-body">
            <h2 className="card-title text-primary flex gap-2">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              Conditions
            </h2>

            {conditions.map((condition, index) => {
              const fact =
                condition.value?.fact ?? RuleConditionFact.FamilyStatus;
              const value = String(
                condition.value?.value ?? FamilyStatusEnum.NEW
              );

              return (
                <div key={condition.key}>
                  <div className="flex items-center gap-2 mt-4">
                    {index === 0 ? <span>If</span> : <span>Or</span>}
                    <select
                      className="select select-bordered w-[240px]"
                      name={`${condition.name}.fact`}
                      value={fact}
                      onChange={(e) => {
                        // this is handling updates for the hook that fetches rule matches
                        const newFact = e.target.value as RuleConditionFact;
                        form.update({
                          [`conditions.${index}.fact`]: newFact,
                          [`conditions.${index}.value`]:
                            newFact === RuleConditionFact.FamilyStatus
                              ? FamilyStatusEnum.NEW
                              : "true",
                        });
                      }}
                    >
                      <option value={RuleConditionFact.FamilyStatus}>
                        Family Status
                      </option>
                      <option value={RuleConditionFact.IsBusinessOwner}>
                        Business Owner
                      </option>
                      <option value={RuleConditionFact.FiledUsTaxes2021}>
                        Filed 2021 Taxes
                      </option>
                    </select>

                    {fact === RuleConditionFact.FamilyStatus ? (
                      <select
                        className="select select-bordered w-[240px]"
                        name={`${condition.name}.value`}
                        value={value}
                        onChange={(e) => {
                          form.update({
                            [`conditions.${index}.value`]: e.target.value,
                          });
                        }}
                      >
                        <option value={FamilyStatusEnum.NEW}>New</option>
                        <option value={FamilyStatusEnum.RETURNING}>
                          Returning
                        </option>
                      </select>
                    ) : (
                      <select
                        className="select select-bordered w-[240px]"
                        name={`${condition.name}.value`}
                        value={value}
                        onChange={(e) => {
                          form.update({
                            [`conditions.${index}.value`]: e.target.value,
                          });
                        }}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    )}

                    {conditions.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() =>
                          form.remove({name: fields.conditions.name, index})
                        }
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              className="btn btn-link text-primary p-0 justify-start mt-4"
              onClick={handleAddCondition}
            >
              Add Condition
            </button>

            <div className="flex items-center gap-2 text-base-content/60 text-sm mt-2">
              <div className="bg-base-200 p-1 rounded-full">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              Given conditions match with {count} existing applicants.
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-success flex gap-2">
              <div className="bg-success/10 p-1.5 rounded-full">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              Actions
            </h2>

            {actions.map((action, index) => (
              <div key={action.key}>
                <div className="flex gap-3 mt-4">
                  <select
                    className="select select-bordered w-[240px]"
                    name={`${action.name}.value`}
                    defaultValue={action.value?.value}
                  >
                    {documents.map(({id, name}: {id: string; name: string}) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Description of Document"
                    className="input input-bordered flex-1"
                    name={`${action.name}.description`}
                    defaultValue={action.value?.description}
                  />
                  {actions.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() =>
                        form.remove({name: fields.actions.name, index})
                      }
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-link text-primary p-0 justify-start mt-4"
              onClick={handleAddAction}
            >
              Create document request
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
}
