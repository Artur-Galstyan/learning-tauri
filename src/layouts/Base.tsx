import { Outlet } from "react-router";

export default function Layout() {
  return (
    <main className="w-[80%] mx-auto my-10">
      <Outlet />
    </main>
  );
}
