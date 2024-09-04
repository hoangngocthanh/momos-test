import AppLayout from "@layouts/AppLayout";
import NotfoundErrorPage from "@pages/ErrorPages/NotfoundErrorPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "src/contexts/AuthContext";
import ProtectedComponent from "./ProtectedComponent";
import routesConfig from "./RoutesConfig";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthContextProvider>
          <Outlet />
        </AuthContextProvider>
      ),
      children: [
        ...routesConfig.map((route) => {
          const routeWithLayout = (
            <AppLayout>
              <route.component />
            </AppLayout>
          );

          if (route.requiredAuth) {
            return {
              ...route,
              element: (
                <ProtectedComponent>{routeWithLayout}</ProtectedComponent>
              ),
            };
          }
          return {
            ...route,
            element: routeWithLayout,
          };
        }),
      ],
    },

    {
      path: "*",
      element: <NotfoundErrorPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
