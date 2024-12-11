import {parseWithZod} from "@conform-to/zod";
import {ActionFunctionArgs, json} from "@remix-run/node";
import {apiClient} from "../apiClient";
import RuleForm from "../components/forms/Rule/RuleForm";
import {formSchema} from "../components/forms/Rule/helper";
import {redirect} from "@remix-run/react";

export default function CreateRule() {
  return <RuleForm />;
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
  const res = await apiClient.ruleControllerCreateRule(submission.payload);
  console.log("RESPONSE FROM SAVE!!!", res);
  return redirect("/rules");

  // console.log("Validated data:", submission.value);
  // return json({status: "success", submission: submission.value});
}
