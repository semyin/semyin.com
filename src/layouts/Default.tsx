export { DefaultLayout };
import { Outlet } from "react-router";

function DefaultLayout() {
  return (
    <div className="default-layout">
      <Outlet />
    </div>
  );
}