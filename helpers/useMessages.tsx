import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import { TChatHistory, TMessage } from "../components/ChatHistory";
import { useState } from "react";

const KEY = "chatHistory";

export const useMessages = () => {
  const [chatHistoryLS, updateChatHistoryLS] = useLocalStorage(KEY, "");
  const [chatHistory, updateChatHistory] = useState<TChatHistory>([]);

  useEffectOnce(() => {
    if (chatHistoryLS) {
      updateChatHistory(JSON.parse(chatHistoryLS) as TChatHistory);
    }
  });

  const updateChatHistoryBoth = (newMessage: TMessage) => {
    updateChatHistory((prev) => {
      const newChatHistory = [...prev, newMessage];
      updateChatHistoryLS(JSON.stringify(newChatHistory));
      return newChatHistory;
    });
  };

  const resetChatHistory = () => {
    // TODO(iprokopovich): add a confirmation dialog and clear api context
    updateChatHistory([]);
    updateChatHistoryLS("");
  };

  const addMessageToHistory = (message: Pick<TMessage, "text" | "user">) => {
    const newMessage: TMessage = {
      text: message.text,
      timestamp: Date.now().toString(),
      user: message.user,
    };

    updateChatHistoryBoth(newMessage);
  };

  return {
    chatHistory,
    resetChatHistory,
    addMessageToHistory,
  };
};
