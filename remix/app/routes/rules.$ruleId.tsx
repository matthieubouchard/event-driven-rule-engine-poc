import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {apiClient} from "../apiClient";
import {redirect, useLoaderData, useNavigation} from "@remix-run/react";
import {parseWithZod} from "@conform-to/zod";
import {formSchema} from "../components/forms/Rule/helper";
import RuleForm, {RuleFormProps} from "../components/forms/Rule/RuleForm";

export async function loader({params}: LoaderFunctionArgs) {
  console.log("params", params);
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
    console.count(" nav state loading");
    return <div>Loading...</div>;
  }
  const latestVersion = rule.versions[0];
  const initialData: RuleFormProps["initialData"] = {
    ...latestVersion.ruleJson,
    name: rule.name,
    description: rule.description,
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
  console.log("payload??", submission.payload);
  const res = await apiClient.ruleControllerUpdateRule(
    params.ruleId as string,
    submission.payload
  );
  console.log("RESPONSE FROM UPDATE!!!", res);
  return redirect("/rules");

  // console.log("Validated data:", submission.value);
  // return json({status: "success", submission: submission.value});
}
