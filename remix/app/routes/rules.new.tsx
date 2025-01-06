import { ActionFunctionArgs, json } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { CreateRuleDto } from '@server/src/api_docs/api';

import { apiClient } from '../apiClient';
import RuleForm from '../components/forms/Rule/RuleForm';
import { transformAndValidateFormData } from '../components/forms/Rule/helper';

export async function loader() {
  const res = await apiClient.documentControllerFindAll();
  if (!res.ok) throw new Response('Documents not found', { status: 404 });
  const documents = await res.json();
  return json({ documents });
}

export default function CreateRule() {
  return <RuleForm method="post" />;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = transformAndValidateFormData(formData);

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  await apiClient.ruleControllerCreateRule(submission.payload as unknown as CreateRuleDto);
  return redirect('/rules');
}
