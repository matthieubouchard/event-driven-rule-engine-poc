import { Link, useLocation } from '@remix-run/react';

import Logo from './Logo';

const Nav = () => {
  const location = useLocation();
  const routes = [
    {
      name: 'Applications',
      path: '/applications',
    },

    {
      name: 'Rules',
      path: '/rules',
    },
  ];
  return (
    <div className="navbar bg-base-100 px-20">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          <Logo />
          Rule Engine
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-20">
          {routes.map((route) => {
            return (
              <Link
                key={route.path}
                to={route.path}
                className={`
                  px-4 py-2 text-gray-700 hover:text-gray-900
                  ${location.pathname.startsWith(route.path) ? 'border-b-2 border-purple-600' : ''}
                    `}
              >
                {route.name}
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Nav;
