import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {apiClient} from "../apiClient";
import {redirect, useLoaderData, useNavigation} from "@remix-run/react";
import {parseWithZod} from "@conform-to/zod";
import {formSchema} from "../components/forms/Rule/helper";
import RuleForm, {RuleFormProps} from "../components/forms/Rule/RuleForm";

export async function loader({params}: LoaderFunctionArgs) {
  const res = await apiClient.ruleControllerFindOne(params.ruleId!);
  if (!res.ok) throw new Response("Rule not found", {status: 404});
  const rule = await res.json();
  return json(rule);
}

export default function EditRule() {
  const rule = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  // Show loading state during navigation
  if (navigation.state === "loading") {
    return <div>Loading...</div>;
  }
  const latestVersion = rule.versions[0];
  const initialData: RuleFormProps["initialData"] = {
    name: latestVersion.name,
    description: latestVersion.description,
    conditions: latestVersion.ruleJson.conditions,
    actions: latestVersion.ruleJson.actions,
  };

  console.log("Initial data being passed to form", initialData);

  return <RuleForm key={rule.id} initialData={initialData} method="put" />;
}

export async function action({request, params}: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: formSchema,
  });
  console.log("submission", submission);

  if (submission.status !== "success") {
    return json(submission.reply());
  }
  const res = await apiClient.ruleControllerUpdateRule(
    params.ruleId as string,
    submission.payload
  );
  return redirect("/rules");
}
