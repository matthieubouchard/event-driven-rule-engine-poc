import {Link} from "@remix-run/react";

const Nav = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Clarity Rule Engine
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Applications</Link>
          </li>
          <li>
            <Link to="/rules">Rules</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
