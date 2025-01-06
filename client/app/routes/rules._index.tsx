import { Link, useLoaderData, useRevalidator } from '@remix-run/react'
import { Rule } from '@server/src/api_docs/api'

import { apiClient } from '../apiClient'

export async function loader(): Promise<Rule[]> {
  const rules = await apiClient.ruleControllerFindAll()

  if (!rules) {
    throw new Response('Failed to load rules', { status: 404 })
  }
  return await rules.json()
}

export default function Rules() {
  const data = useLoaderData<typeof loader>()
  const validator = useRevalidator()

  const handleRuleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault() // Prevent the Link from triggering
    e.stopPropagation() // Stop event bubbling
    if (confirm('Are you sure you want to delete this rule?')) {
      await apiClient.ruleControllerSoftDelete(id)
      validator.revalidate()
    }
  }
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'white' }}>
          Rules
        </h1>
        <Link
          to="/rules/new"
          className="btn bg-purple-600 hover:bg-purple-700 text-white border-none px-6 py-2 rounded-lg shadow-md transition-colors"
        >
          Add Rule
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data.map((rule) => (
          <Link to={`/rules/${rule.id}`} key={rule.id} className="no-underline">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-lg font-semibold text-gray-800">{rule.versions[0].name}</h2>
                  <button onClick={(e) => handleRuleDelete(e, rule.id)} className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="badge badge-outline">{rule.versions[0].ruleJson.conditions?.length || 0} conditions</div>
                  <div className="badge badge-outline">{rule.versions[0].ruleJson.actions?.length || 0} actions</div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <span className="text-sm text-purple-600">View Details →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No rules created yet</p>
          <Link to="/rules/new" className="text-purple-600 hover:text-purple-700 font-medium">
            Create your first rule
          </Link>
        </div>
      )}
    </div>
  )
}
