import { MessageInstance } from "antd/es/message/interface";
import { HookAPI } from "antd/es/modal/useModal";
import { NotificationInstance } from "antd/es/notification/interface";

export interface GlobalContextInitProps {
  messageApi: MessageInstance | null;
  notificationApi: NotificationInstance | null;
  modalApi: HookAPI | null;
}

export interface GlobalContextProps extends GlobalContextInitProps {
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
  modalApi: HookAPI;
}

export interface GlobalContextProviderProps {
  children: React.ReactNode;
}
