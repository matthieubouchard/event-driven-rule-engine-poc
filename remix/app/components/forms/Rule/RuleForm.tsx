import {useEffect} from "react";
import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {Form, FormMethod, useLoaderData, useNavigate} from "@remix-run/react";
import {
  FamilyStatusCondition,
  FamilyStatusFact,
  BusinessOwnerCondition,
  Filed2021Condition,
  Action,
} from "../../../../../server/src/api_docs/api";
// import {CONDITION}

import {CONDITIONS, FAMILY_STATUS, formSchema} from "./helper";

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

export default function RuleForm({
  initialData,
  method = "post",
}: RuleFormProps) {
  const {documents} = useLoaderData<typeof loader>();
  console.log("GOT DOCUMENTS", documents);
  const navigate = useNavigate();

  const [form, fields] = useForm({
    defaultValue: initialData ?? {
      conditions: [
        {
          fact: FamilyStatusFact.FamilyStatus,
          value: "NEW",
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
    onValidate({formData}) {
      const result = parseWithZod(formData, {schema: formSchema});
      console.log("Form validation result:", result);
      if (result.status === "error") {
        console.log("Validation errors:", result.error);
      }
      return result;
    },
    shouldValidate: "onBlur",
  });
  useEffect(() => {
    if (initialData) {
      form.validate();
    }
  }, [initialData, form]);

  // Reset form when navigating between routes
  // useEffect(() => {
  //   if (navigation.location?.pathname === "/rules/new") {
  //     form.reset();
  //     setIsInitialized(false);
  //   }
  // }, [navigation.location, form]);

  // useEffect(() => {
  //   if (initialData) {
  //     form.reset();
  //   }
  // }, [initialData, form]);

  const handleAddCondition = () => {
    form.insert({
      name: fields.conditions.name,
      defaultValue: {
        fact: CONDITIONS.FAMILY_STATUS,
        value: FAMILY_STATUS.RETURNING,
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
  const nameField = fields.name;
  console.log("name field", nameField.errors);

  const renderConditionInput = (condition) => {
    console.log("CONDITION", condition.value.fact, condition.value);

    // Ensure we have both type and value before rendering
    if (!condition.value?.fact) {
      console.warn("Missing condition fact:", condition);
      return null;
    }

    const value = String(condition.value.value); // Convert to string for select comparison

    switch (condition.value.fact) {
      case CONDITIONS.FAMILY_STATUS:
        return (
          <select
            className="select select-bordered w-[240px]"
            name={`${condition.name}.value`}
            defaultValue={value}
          >
            <option value={FAMILY_STATUS.NEW}>New</option>
            <option value={FAMILY_STATUS.RETURNING}>Returning</option>
          </select>
        );
      case CONDITIONS.BUSINESS_OWNER:
        return (
          <select
            className="select select-bordered w-[240px]"
            name={`${condition.name}.value`}
            defaultValue={value}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      case CONDITIONS.FILED_2021:
        return (
          <select
            className="select select-bordered w-[240px]"
            name={`${condition.name}.value`}
            defaultValue={value}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      default:
        console.warn("Unknown condition type:", condition.value.fact);
        return null;
    }
  };

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
              fields.name.errors.map((error) => {
                return (
                  <div key={error} className="text-error text-sm mt-1">
                    {error}
                  </div>
                );
              })}
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
              fields.description.errors.map((error) => {
                return (
                  <div key={error} className="text-error text-sm mt-1">
                    {error}
                  </div>
                );
              })}
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

            {conditions.map((condition, index) => (
              <div key={condition.key}>
                <div className="flex items-center gap-2 mt-4">
                  {index === 0 ? <span>If</span> : <span>Or</span>}
                  <select
                    className="select select-bordered w-[240px]"
                    name={`${condition.name}.fact`}
                    defaultValue={condition?.value?.fact}
                  >
                    <option value={CONDITIONS.FAMILY_STATUS}>
                      Family Status
                    </option>
                    <option value={CONDITIONS.BUSINESS_OWNER}>
                      Business Owner
                    </option>
                    <option value={CONDITIONS.FILED_2021}>
                      Filed 2021 Taxes
                    </option>
                  </select>
                  {renderConditionInput(condition)}
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
            ))}

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
              Given conditions match with 692 existing applicants.
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

            {actions.map((action, index) => {
              console.log("action.value", action.value);
              console.log("action", action.name);
              return (
                <div key={action.key}>
                  <div className="flex gap-3 mt-4">
                    <select
                      className="select select-bordered w-[240px]"
                      name={`${action.name}.value`}
                      defaultValue={action.value?.value}
                    >
                      {documents.map(
                        ({id, name}: {id: string; name: string}) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        )
                      )}
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
                  {/* {action.error && (
                    <div className="text-error text-sm mt-1">
                      {action.error}
                    </div>
                  )} */}
                </div>
              );
            })}

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
