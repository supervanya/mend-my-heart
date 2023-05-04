import { TMessage } from "./types";
import { TPersonas } from "./constants";
import { useStorage } from "./useStorage";

export const useMessages = (persona: TPersonas) => {
  const {
    chat: chatHistory,
    resetChat: resetChatHistory,
    updateChat: updateChatHistory,
  } = useStorage(persona);

  const addMessageToHistory = (message: Pick<TMessage, "content" | "role">) => {
    const newMessage: TMessage = {
      content: message.content,
      timestamp: Date.now().toString(),
      role: message.role,
    };

    updateChatHistory((prevChat) => [...prevChat, newMessage]);
  };

  return {
    chatHistory,
    resetChatHistory,
    addMessageToHistory,
  };
};
