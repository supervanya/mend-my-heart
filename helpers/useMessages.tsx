import { useEffectOnce, useLocalStorage } from "usehooks-ts";
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

const parseChatHistory = (chatHistoryLS: string): TChatHistory =>
  chatHistoryLS ? JSON.parse(chatHistoryLS) : [];

export const useMessages = (persona: TPersonas) => {
  const [chatHistoryLS, updateChatHistoryLS] = useLocalStorage(persona, "");
  const chatHistory = parseChatHistory(chatHistoryLS);

  useEffectOnce(migrateIfNecessary);

  const writeMessageToLS = (newMessage: TMessage) => {
    const newChatHistory = [...chatHistory, newMessage];
    updateChatHistoryLS(JSON.stringify(newChatHistory));
  };

  const resetChatHistory = () => {
    // TODO(iprokopovich): add a confirmation dialog and clear api context
    updateChatHistoryLS("");
  };

  const addMessageToHistory = (message: Pick<TMessage, "content" | "role">) => {
    const newMessage: TMessage = {
      content: message.content,
      timestamp: Date.now().toString(),
      role: message.role,
    };

    writeMessageToLS(newMessage);
  };

  return {
    chatHistory,
    resetChatHistory,
    addMessageToHistory,
  };
};
