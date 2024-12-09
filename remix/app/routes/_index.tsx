import {type MetaFunction} from "@remix-run/node";
import {Link} from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {title: "New Remix App"},
    {name: "description", content: "Welcome to Remix!"},
  ];
};

export default function Index() {
  return (
    <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.8"}}>
      <h1>Dashboard</h1>
      <ul>
        <li>All /api routes go to Nest js</li>
        <li>All /build and /assets is served by nest from /remix/public</li>
        <li>All other routes go to Remix</li>
        <li>
          <Link to="/rules">Go to Rules</Link>
        </li>
      </ul>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <div className="grid gap-4">
          <div key="123" className="card bg-base-100 w-96 shadow-xl">
            <figure>
              <img
                src={`https://picsum.photos/200/${Math.floor(
                  Math.random() * 300
                )}`}
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {"matthew bouchard" || "Unamed user"}
              </h2>
              <p>bouchard.matthewj@gmail.com</p>
              <p>Joined: {new Date().toLocaleDateString("en-US")} </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
