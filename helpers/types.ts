export type TUser = "user" | "assistant";

export type TMessage = {
  content: string;
  role: TUser;
  timestamp: string;
};

export type TChatHistory = TMessage[];
