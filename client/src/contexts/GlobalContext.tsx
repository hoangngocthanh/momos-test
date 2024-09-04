import { App } from "antd";
import { createContext, useMemo } from "react";
import { GlobalContextInitProps, GlobalContextProviderProps } from "src/types";

export const GlobalContext = createContext<GlobalContextInitProps>({
  messageApi: null,
  notificationApi: null,
  modalApi: null,
});

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({
  children,
}) => {
  const {
    message: messageApi,
    notification: notificationApi,
    modal: modalApi,
  } = App.useApp();

  const memoValues = useMemo(() => {
    return {
      messageApi,
      notificationApi,
      modalApi,
    };
  }, [messageApi, notificationApi, modalApi]);

  return (
    <GlobalContext.Provider value={memoValues}>
      {children}
    </GlobalContext.Provider>
  );
};
