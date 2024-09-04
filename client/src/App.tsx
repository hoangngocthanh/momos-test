import RouterProviderComp from "@routers/Router";
import { QueryClientProvider as TanStackQueryProvider } from "@tanstack/react-query";
import {
  App as AntAppComponent,
  ConfigProvider as AntConfigProvider,
} from "antd";
import reactQueryClient from "./configs/react-query-client";
import { GlobalContextProvider } from "./contexts/GlobalContext";
import "./styles/normalize.css";

const App: React.FC = () => {
  return (
    <AntConfigProvider>
      <AntAppComponent>
        <GlobalContextProvider>
          <TanStackQueryProvider client={reactQueryClient}>
            <RouterProviderComp />
          </TanStackQueryProvider>
        </GlobalContextProvider>
      </AntAppComponent>
    </AntConfigProvider>
  );
};

export default App;
