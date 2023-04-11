import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import { useState } from "react";
import { TChatHistory, TMessage } from "./types";
import { LOCAL_STORAGE_KEY } from "./constants";

export const useMessages = () => {
  const [chatHistoryLS, updateChatHistoryLS] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    ""
  );
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

  const addMessageToHistory = (message: Pick<TMessage, "content" | "role">) => {
    const newMessage: TMessage = {
      content: message.content,
      timestamp: Date.now().toString(),
      role: message.role,
    };

    updateChatHistoryBoth(newMessage);
  };

  return {
    chatHistory,
    resetChatHistory,
    addMessageToHistory,
  };
};
