import LoginPage from "@pages/AuthenticationPages/LoginPage/LoginPage";
import RegisterPage from "@pages/AuthenticationPages/LoginPage/RegisterPage";
import DataPage from "@pages/DataPage/DataPage";
import NotfoundErrorPage from "@pages/ErrorPages/NotfoundErrorPage";
import HomePage from "@pages/HomePage/HomePage";

import { RouteObject } from "react-router-dom";

type IRoute = RouteObject & {
  requiredAuth?: boolean;
  layout?: React.FC;
  children?: IRoute[];
  component: React.FC;
};

const routesConfig: IRoute[] = [
  {
    path: "/",
    component: HomePage,
    requiredAuth: true,
    index: true,
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/register",
    component: RegisterPage,
  },
  {
    path: "/data",
    component: DataPage,
    requiredAuth: true,
  },
  {
    path: "*",
    component: NotfoundErrorPage,
  },

  // Add more route later
];

export default routesConfig;
