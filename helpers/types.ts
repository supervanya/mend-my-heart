import { TPersonas } from "./constants";

export type TUser = "user" | "assistant";

export type TMessage = {
  content: string;
  role: TUser;
  timestamp: string;
};

export type TChatHistory = TMessage[];

export interface TApiRequestBody {
  messages: TChatHistory;
  persona: TPersonas;
}

export type TApiResponseBody = string;
