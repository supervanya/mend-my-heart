import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import { ChatHistory } from "../components/ChatHistory";
import { useState } from "react";

const KEY = "chatHistory";

export const useMessages = () => {
  const [chatHistory, updateChatHistory] = useState<ChatHistory | null>(null);
  const [chatHistoryLS, updateChatHistoryLS] = useLocalStorage(KEY, "");

  useEffectOnce(() => {
    if (chatHistoryLS) {
      updateChatHistory(JSON.parse(chatHistoryLS) as ChatHistory);
    }
  });

  const updateChatHistoryBoth = (newChatHistory: ChatHistory) => {
    updateChatHistoryLS(JSON.stringify(newChatHistory));
    updateChatHistory(newChatHistory);
  };

  return { chatHistory, updateChatHistory: updateChatHistoryBoth };
};
