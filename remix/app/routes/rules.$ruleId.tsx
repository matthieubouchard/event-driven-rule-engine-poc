import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import {redirect, useLoaderData, useNavigation} from "@remix-run/react";
import {apiClient} from "../apiClient";
import {transformAndValidateFormData} from "../components/forms/Rule/helper";
import RuleForm, {RuleFormProps} from "../components/forms/Rule/RuleForm";
import {CreateRuleDto} from "@server/src/api_docs/api";

export async function loader({params}: LoaderFunctionArgs) {
  const [ruleRes, documentsRes] = await Promise.all([
    apiClient.ruleControllerFindOne(params.ruleId!),
    apiClient.documentControllerFindAll(),
  ]);

  if (!ruleRes.ok) throw new Response("Rule not found", {status: 404});
  if (!documentsRes.ok)
    throw new Response("Documents not found", {status: 404});

  const [rule, documents] = await Promise.all([
    ruleRes.json(),
    documentsRes.json(),
  ]);

  return json({rule, documents});
}

export default function EditRule() {
  const {rule} = useLoaderData<typeof loader>();
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
  const submission = transformAndValidateFormData(formData);

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  await apiClient.ruleControllerUpdateRule(
    params.ruleId as string,
    submission.payload as unknown as CreateRuleDto
  );
  return redirect("/rules");
}
