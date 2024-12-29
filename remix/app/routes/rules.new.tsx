import {parseWithZod} from "@conform-to/zod";
import {ActionFunctionArgs, json} from "@remix-run/node";
import {apiClient} from "../apiClient";
import RuleForm from "../components/forms/Rule/RuleForm";
import {formSchema} from "../components/forms/Rule/helper";
import {redirect} from "@remix-run/react";

export async function loader() {
  const res = await apiClient.documentControllerFindAll();
  if (!res.ok) throw new Response("Documents not found", {status: 404});
  const documents = await res.json();
  return json({documents});
}

export default function CreateRule() {
  return <RuleForm method="post" />;
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
}
