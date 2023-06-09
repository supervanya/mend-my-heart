import { TChatHistory, TMessage, TUser } from "./types";

export const combineMessages = (
  history: TChatHistory,
  message: string,
  user: TUser
) => {
  const timestamp = new Date().toISOString();
  const newMessage: TMessage = { content: message, role: user, timestamp };
  return [...history, newMessage];
};

export const waitASecond = (s = 1) =>
  new Promise((res) => setTimeout(res, s * 1000));
