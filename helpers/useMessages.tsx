import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import { useState } from "react";
import { TChatHistory, TMessage } from "./types";
import { TPersonas } from "./constants";

export const OLD_LOCAL_STORAGE_KEY = "chatHistory";
const migrateIfNecessary = () => {
  const chatHistoryLS = localStorage.getItem(OLD_LOCAL_STORAGE_KEY);
  if (chatHistoryLS) {
    const oldKey: TPersonas = "relationshipTherapist";
    localStorage.setItem(oldKey, chatHistoryLS);
    localStorage.removeItem(OLD_LOCAL_STORAGE_KEY);
  }
};

export const useMessages = (persona: TPersonas) => {
  const [chatHistoryLS, updateChatHistoryLS] = useLocalStorage(persona, "");
  const [chatHistory, updateChatHistory] = useState<TChatHistory>([]);

  useEffectOnce(() => {
    migrateIfNecessary();
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
