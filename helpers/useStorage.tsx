import { useEffectOnce } from "react-use";
import { TPersonas } from "./constants";
import { TChatHistory } from "./types";
import { setStorageValue, useLocalStorage } from "./useLocalStorage";
import { isArray } from "lodash";

const runMigrations = () => {
  // this was used with the initial release of the app
  const OLD_KEY = "chatHistory";
  const OLD_PERSONA: TPersonas = "relationshipTherapist";

  try {
    const oldRelationshipChatHistory = localStorage.getItem(OLD_KEY);

    if (oldRelationshipChatHistory) {
      let parsed = JSON.parse(oldRelationshipChatHistory);

      if (!isArray(parsed)) {
        parsed = JSON.parse(parsed);
      }

      if (isArray(parsed)) {
        console.warn("Migrating old chat history to new format", parsed);
        setStorageValue(OLD_PERSONA, parsed);
        // localStorage.removeItem(OLD_KEY);
      }
    }
  } catch (error) {
    console.error("Error migrating old chat history", error);
  }
};

export const useStorage = (persona: TPersonas) => {
  useEffectOnce(runMigrations);

  const [chat, updateChat] = useLocalStorage<TChatHistory>(persona, []);

  const resetChat = () => updateChat([]);

  return { chat, updateChat, resetChat };
};
