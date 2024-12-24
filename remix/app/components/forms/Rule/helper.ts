import {z} from "zod";

export const CONDITIONS = {
  FAMILY_STATUS: "familyStatus",
  BUSINESS_OWNER: "isBusinessOwner",
  FILED_2021: "filedUsTaxes2021",
} as const;

export enum FAMILY_STATUS {
  NEW = "NEW",
  RETURNING = "RETURNING",
}

export const DOCUMENT_TYPES = {
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

export const DOCUMENT_LABELS = {
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

export const formSchema = z.object({
  name: z.string().min(3, "Min length is 3"),
  description: z.string(),
  conditions: z
    .array(
      z.discriminatedUnion("fact", [
        z.object({
          fact: z.literal(CONDITIONS.FAMILY_STATUS),
          value: z.nativeEnum(FAMILY_STATUS),
        }),
        z.object({
          fact: z.literal(CONDITIONS.BUSINESS_OWNER),
          value: z.string().transform((val) => val === "true"),
        }),
        z.object({
          fact: z.literal(CONDITIONS.FILED_2021),
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
        description: z.string().optional(),
      })
    )
    .min(1, "At least one action is required"),
});
