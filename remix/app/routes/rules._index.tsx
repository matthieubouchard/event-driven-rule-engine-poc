import {Link} from "@remix-run/react";

export default function Rules() {
  return (
    <>
      <h1>Rules</h1>
      <Link to="/rules/new">Add a rule</Link>
    </>
  );
}
