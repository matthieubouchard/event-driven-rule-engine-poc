import { ApplicationResponseDto } from '@server/src/api_docs/api'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

function RuleAuditLogTable({ auditLog }: { auditLog: ApplicationResponseDto['ruleAudits'] }) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)

  return (
    <div className="mt-4">
      <button onClick={toggle} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-2">
        Audit Log
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {open && (
        <div className="overflow-x-auto">
          <h3 className="text-sm font-medium text-gray-600">Displaying up to last 20 results</h3>
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Version</th>
                <th>Evaluated At</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.ruleVersion.name}</td>
                  <td className="text-center">{entry.ruleVersion.version}</td>
                  <td>{new Date(entry.evaluatedAt).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${entry.matched ? 'badge-success' : 'badge-error'}`}>{entry.matched ? 'Matched' : 'Not Matched'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RuleAuditLogTable
