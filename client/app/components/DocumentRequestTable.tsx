import { ApplicationResponseDto } from '@server/src/api_docs/api'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

function DocumentRequestsTable({ requests }: { requests: ApplicationResponseDto['documentRequests'] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-4">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-2">
        Document Requests
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {open && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {requests?.map((request) => (
                <tr key={request.id}>
                  <td>{request.document.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        request.status === 'PENDING'
                          ? 'badge-warning'
                          : request.status === 'SUBMITTED'
                            ? 'badge-success'
                            : request.status === 'REJECTED'
                              ? 'badge-error'
                              : 'badge-info'
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>{new Date(request.requestedAt).toLocaleString()}</td>
                  <td>{new Date(request?.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DocumentRequestsTable
