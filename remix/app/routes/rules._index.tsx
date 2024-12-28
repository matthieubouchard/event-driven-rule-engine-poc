import {Link, useLoaderData} from "@remix-run/react";
import {apiClient} from "../apiClient";
import {json} from "@remix-run/node";

export async function loader() {
  const res = await apiClient.ruleControllerFindAll();

  if (!res) {
    throw new Response("Failed to load rules", {status: 404});
  }
  const feRules = await res.json();

  return json(feRules);
}

export default function Rules() {
  const data = useLoaderData();
  console.log("data", data);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Rules</h1>
        <Link
          to="/rules/new"
          className="btn bg-purple-600 hover:bg-purple-700 text-white border-none px-6 py-2 rounded-lg shadow-md transition-colors"
        >
          Add Rule
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((rule) => (
          <Link to={`/rules/${rule.id}`} key={rule.id} className="no-underline">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold text-gray-800">
                  {rule.versions[0].name}
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="badge badge-outline">
                    {rule.versions[0].ruleJson.conditions?.length || 0}{" "}
                    conditions
                  </div>
                  <div className="badge badge-outline">
                    {rule.versions[0].ruleJson.actions?.length || 0} actions
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <span className="text-sm text-purple-600">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No rules created yet</p>
          <Link
            to="/rules/new"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Create your first rule
          </Link>
        </div>
      )}
    </div>
  );
}
