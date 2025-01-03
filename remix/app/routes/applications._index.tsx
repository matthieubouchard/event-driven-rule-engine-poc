import React, {useState} from "react";
import {Link, useLoaderData, Form} from "@remix-run/react";
import {ActionFunctionArgs, json} from "@remix-run/node";
import {ChevronDown, ChevronRight} from "lucide-react";
import {apiClient} from "../apiClient";
import {ApplicationResponseDto} from "@server/src/api_docs/api";

export async function loader(): Promise<ApplicationResponseDto[]> {
  const res = await apiClient.applicationControllerFindAll();
  // todo: handle error
  const applications = await res.json();
  return applications;
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const applicationId = formData.get("applicationId");
  const res =
    await apiClient.applicationControllerProcessApplication(applicationId);
  if (!res.ok)
    throw new Response("Failed to process application", {
      status: 500,
    });
  console.log("res");

  // This would be where you trigger your Kafka event or API call
  console.log(`Processing application ${applicationId}`);

  return json({success: true});
}

function AuditLog({
  auditLog,
}: {
  auditLog: ApplicationResponseDto["ruleAudits"];
}) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <div className="mt-4">
      <button
        onClick={toggle}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-2"
      >
        Audit Log
        {open ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="overflow-x-auto">
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
                    <span
                      className={`badge ${
                        entry.matched ? "badge-success" : "badge-error"
                      }`}
                    >
                      {entry.matched ? "Matched" : "Not Matched"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default function Applications() {
  const applications = useLoaderData<typeof loader>();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Applications</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {applications.map((application) => (
          <div key={application.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title text-lg font-semibold text-gray-800">
                    {application.student.firstName}{" "}
                    {application.student.lastName}
                  </h2>
                  <div className="flex gap-2 mt-2">
                    {application.isBusinessOwner && (
                      <span className="badge badge-outline">
                        Business Owner
                      </span>
                    )}
                    {!application.filedUsTaxes2021 && (
                      <span className="badge badge-outline">No 2021 Taxes</span>
                    )}
                  </div>
                </div>
              </div>

              <AuditLog auditLog={application.ruleAudits} />

              <div className="card-actions justify-end mt-4">
                <Form method="post">
                  <input
                    type="hidden"
                    name="applicationId"
                    value={application.id}
                  />
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
  );
}
