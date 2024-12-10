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
        {/* public */}
        <Route path={loginPath} element={login} />
        <Route element={layout}>{publicRoutes}</Route>

        {/* private */}
        <Route element={<Guard>{layout}</Guard>}>{protectedRoutes}</Route>
      </Route>
    </Routes>
  );
}
