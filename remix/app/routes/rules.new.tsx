import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {ActionFunctionArgs, json} from "@remix-run/node";
import {Form} from "@remix-run/react";
import {z} from "zod";

const CONDITIONS = {
  FAMILY_STATUS: "familyStatus",
  BUSINESS_OWNER: "businessOwner",
  FILED_2021: "filed2021",
} as const;

enum FAMILY_STATUS {
  NEW = "NEW",
  RETURNING = "RETURNING",
}

const DOCUMENT_TYPES = {
  TAX_1040: "1040",
  W2_PARENT_A_PREV: "W2_PARENT_A_PREV",
  W2_PARENT_B_PREV: "W2_PARENT_B_PREV",
  W2_PARENT_A_CURR: "W2_PARENT_A_CURR",
  W2_PARENT_B_CURR: "W2_PARENT_B_CURR",
  PAYSTUB: "PAYSTUB",
  BUSINESS_TAX: "BUSINESS_TAX",
  BANK_STATEMENT: "BANK_STATEMENT",
  TAX_1120S: "1120S",
  K1: "K1",
  TAX_1065: "1065",
  PARENT_A_WAIVER: "PARENT_A_WAIVER",
  PARENT_B_WAIVER: "PARENT_B_WAIVER",
  UNEMPLOYMENT: "UNEMPLOYMENT",
  TAX_1099: "1099",
  STATE_TAX: "STATE_TAX",
  PROOF_OF_DEBT: "PROOF_OF_DEBT",
} as const;

const DOCUMENT_LABELS = {
  [DOCUMENT_TYPES.TAX_1040]: "1040",
  [DOCUMENT_TYPES.W2_PARENT_A_PREV]: "W2 Parent A (Previous Year)",
  [DOCUMENT_TYPES.W2_PARENT_B_PREV]: "W2 Parent B (Previous Year)",
  [DOCUMENT_TYPES.W2_PARENT_A_CURR]: "W2 Parent A (Current Year)",
  [DOCUMENT_TYPES.W2_PARENT_B_CURR]: "W2 Parent B (Current Year)",
  [DOCUMENT_TYPES.PAYSTUB]: "Paystub",
  [DOCUMENT_TYPES.BUSINESS_TAX]: "Business Tax Documents",
  [DOCUMENT_TYPES.BANK_STATEMENT]: "Bank Statement",
  [DOCUMENT_TYPES.TAX_1120S]: "1120S",
  [DOCUMENT_TYPES.K1]: "K1",
  [DOCUMENT_TYPES.TAX_1065]: "1065",
  [DOCUMENT_TYPES.PARENT_A_WAIVER]: "Parent A Waiver Form",
  [DOCUMENT_TYPES.PARENT_B_WAIVER]: "Parent B Waiver Form",
  [DOCUMENT_TYPES.UNEMPLOYMENT]: "Unemployment Benefits Statement",
  [DOCUMENT_TYPES.TAX_1099]: "1099",
  [DOCUMENT_TYPES.STATE_TAX]: "State Tax Return",
  [DOCUMENT_TYPES.PROOF_OF_DEBT]: "Proof of Debt",
};

const formSchema = z.object({
  conditions: z
    .array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal(CONDITIONS.FAMILY_STATUS),
          value: z.nativeEnum(FAMILY_STATUS),
        }),
        z.object({
          type: z.literal(CONDITIONS.BUSINESS_OWNER),
          value: z.string().transform((val) => val === "true"),
        }),
        z.object({
          type: z.literal(CONDITIONS.FILED_2021),
          value: z.string().transform((val) => val === "true"),
        }),
      ])
    )
    .min(1, "At least one condition is required"),
  actions: z
    .array(
      z.object({
        type: z.string().default("DOCUMENT_REQUEST"),
        documentType: z.string(),
        description: z.string(),
      })
    )
    .min(1, "At least one document request is required"),
});

export default function RuleForm() {
  const [form, fields] = useForm({
    defaultValue: {
      conditions: [
        {
          type: CONDITIONS.FAMILY_STATUS,
          value: FAMILY_STATUS.NEW,
        },
      ],
      actions: [
        {
          type: "BUSINESS_DOCUMENT",
          documentType: DOCUMENT_TYPES.BUSINESS_TAX,
          description: "",
        },
      ],
    },
    onValidate({formData}) {
      return parseWithZod(formData, {schema: formSchema});
    },
    shouldValidate: "onInput",
  });

  const conditions = fields.conditions.getFieldList();
  const actions = fields.actions.getFieldList();

  const renderConditionInput = (condition) => {
    switch (condition.value.type) {
      case CONDITIONS.FAMILY_STATUS:
        return (
          <select
            className="select select-bordered w-[240px]"
            name={`${condition.name}.value`}
            defaultValue={FAMILY_STATUS.NEW}
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
            defaultValue="false"
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
            defaultValue="false"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <Form id={form.id} onSubmit={form.onSubmit} method="POST">
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
            <button type="button" className="btn">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save and Enable Rule
            </button>
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
                    name={`${condition.name}.type`}
                    defaultValue={CONDITIONS.FAMILY_STATUS}
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
                {condition.error && (
                  <div className="text-error text-sm mt-1">
                    {condition.error}
                  </div>
                )}
              </div>
            ))}

            <button
              className="btn btn-link text-primary p-0 justify-start mt-4"
              {...form.insert.getButtonProps({
                name: fields.conditions.name,
                defaultValue: {
                  type: CONDITIONS.FAMILY_STATUS,
                  value: FAMILY_STATUS.NEW,
                },
              })}
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

            {actions.map((request, index) => (
              <div key={request.key}>
                <div className="flex gap-3 mt-4">
                  <select
                    className="select select-bordered w-[240px]"
                    name={`${request.name}.documentType`}
                    defaultValue={DOCUMENT_TYPES.BUSINESS_TAX}
                  >
                    {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                      <option key={value} value={value}>
                        {DOCUMENT_LABELS[value]}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Description of Document"
                    className="input input-bordered flex-1"
                    name={`${request.name}.description`}
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
                {request.error && (
                  <div className="text-error text-sm mt-1">{request.error}</div>
                )}
              </div>
            ))}

            <button
              className="btn btn-link text-primary p-0 justify-start mt-4"
              {...form.insert.getButtonProps({
                name: fields.actions.name,
                defaultValue: {
                  type: "DOCUMENT_REQUEST",
                  documentType: DOCUMENT_TYPES.BUSINESS_TAX,
                  description: "",
                },
              })}
            >
              Create document request
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: formSchema,
  });
  console.log("submission", submission);

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  console.log("Validated data:", submission.value);
  return json({status: "success", submission: submission.value});
}
