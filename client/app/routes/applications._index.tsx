import { ActionFunctionArgs, json } from '@remix-run/node'
import { useLoaderData, Form } from '@remix-run/react'
import { ApplicationResponseDto } from '@server/src/api_docs/api'

import { apiClient } from '../apiClient'
import DocumentRequestsTable from '../components/DocumentRequestTable'
import RuleAuditLogTable from '../components/RuleAuditLogTable'

export async function loader(): Promise<ApplicationResponseDto[]> {
  const rules = await apiClient.applicationControllerFindAll()
  if (!rules) {
    throw new Response('Failed to load rules', { status: 404 })
  }
  return await rules.json()
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const applicationId = formData.get('applicationId')
  const res = await apiClient.applicationControllerProcessApplication(applicationId as unknown as string)

  if (!res.ok) {
    throw new Response('Failed to process application', {
      status: 500,
    })
  }

  console.log(`Processing application ${applicationId}`)

  return json(res)
}

export default function Applications() {
  const applications = useLoaderData<typeof loader>()
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'white' }}>
          Applications
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {applications.map((application) => (
          <div key={application.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title text-lg font-semibold text-gray-800">{application.school.name}</h2>
                  <h3 className="text-md font-semibold text-gray-600">
                    {application.student.firstName} {application.student.lastName} DOB:{' '}
                    {new Date(application.student.dob).toLocaleDateString().split(',')[0]}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* Family Status Badge */}
                    <span className={`badge ${application.familyStatus === 'NEW' ? 'badge-primary' : 'badge-secondary'}`}>
                      {application.familyStatus === 'NEW' ? 'New Family' : 'Returning Family'}
                    </span>

                    {/* Business Owner Badge */}
                    <span className={`badge ${application.isBusinessOwner ? 'badge-info' : 'badge-outline'}`}>
                      {application.isBusinessOwner ? 'Business Owner' : 'Not Business Owner'}
                    </span>

                    {/* 2021 Taxes Badge */}
                    <span className={`badge ${!application.filedUsTaxes2021 ? 'badge-warning' : 'badge-success'}`}>
                      {application.filedUsTaxes2021 ? 'Filed 2021 Taxes' : 'No 2021 Taxes'}
                    </span>
                  </div>
                </div>
              </div>
              <DocumentRequestsTable requests={application.documentRequests} />
              <RuleAuditLogTable auditLog={application.ruleAudits} />
              <div className="card-actions justify-end mt-4">
                <Form method="post">
                  <input type="hidden" name="applicationId" value={application.id} />
                  <button
                    type="submit"
                    className="btn bg-purple-600 hover:bg-purple-700 text-white border-none px-6 py-2 rounded-lg shadow-md transition-colors"
                  >
                    Process Application
                  </button>
                </Form>
              </div>
            </div>
          </div>
        ))}
      </div>
      {applications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No applications to review</p>
        </div>
      )}
    </div>
  )
}
