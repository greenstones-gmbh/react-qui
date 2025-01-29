import { Outlet, Route, Routes } from "react-router-dom";
import { Guard } from "./Auth";

export function AppRoutes({
  public: publicRoutes,
  protected: protectedRoutes,
  layout = <Outlet />,
  login,
  loginPath = "login",
}: {
  public?: React.ReactNode;
  protected?: React.ReactNode;
  layout?: React.ReactNode;
  login?: React.ReactNode;
  loginPath?: string;
  projectName?: string;
}) {
  return (
    <Routes>
      <Route path="/">
        <Route path={loginPath} element={login} />

        {/* private */}
        <Route element={<Guard>{layout}</Guard>}>{protectedRoutes}</Route>

        {/* public */}
        <Route element={layout}>
          {publicRoutes}
          <Route index element={<div />} />
          <Route path="*" element={<div />} />
        </Route>
      </Route>
    </Routes>
  );
}
