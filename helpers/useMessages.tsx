import { TMessage } from "./types";
import { TPersonas } from "./constants";
import { useDb } from "./useDb";

export const useMessages = (persona: TPersonas) => {
  const { chat, resetChat, updateChat } = useDb(persona);

  const addMessageToHistory = (message: Pick<TMessage, "content" | "role">) => {
    const newMessage: TMessage = {
      content: message.content,
      timestamp: Date.now().toString(),
      role: message.role,
    };

    updateChat(newMessage);
  };

  return {
    chat,
    resetChat,
    addMessageToHistory,
  };
};
