import { Outlet } from "react-router";
import { Link } from "react-router";
import { useNavigation } from "react-router";
import GlobalSpinner from "../components/GlobalSpinner";
import { FaGithubSquare } from "react-icons/fa";
import { useState } from "react";

export default function Layout() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isDrawerOpen}
        onChange={(e) => {
          setIsDrawerOpen(e.target.checked);
        }}
      />
      <div className="drawer-content">
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="drawer"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <FaGithubSquare></FaGithubSquare>
          </label>
          <div className="px-4">
            <Link to="/">Regulaido</Link>
          </div>
        </nav>
        <main className="w-[80%] mx-auto my-10">
          {isNavigating && <GlobalSpinner />}
          <Outlet />
        </main>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 w-40">
          <ul className="menu w-full grow">
            <li>
              <Link
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
                className="w-full"
                to="/"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
                className="w-full"
                to="/about"
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
