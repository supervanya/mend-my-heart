import { db } from "@/db";
import { TPersonas } from "./constants";
import { TMessage } from "./types";
import { useEffectOnce } from "react-use";
import { useLiveQuery } from "dexie-react-hooks";

const runMigrations = () => {
  // this was used with the initial release of the app
  console.warn("implement migrations");
};

export const useDb = (persona: TPersonas) => {
  useEffectOnce(runMigrations);

  const updateChat = (message: TMessage) => {
    db.messages.add({ ...message, persona });
  };

  const chat = useLiveQuery(async () => {
    const chats = await db.messages.where("persona").equals(persona).toArray();

    return chats ?? [];
  }, [persona]);

  const resetChat = () => {
    const confirmed = confirm(
      "Are you sure you want to reset the chat history? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    db.messages.where("persona").equals(persona).delete();
  };

  return {
    chat: chat ?? [],
    updateChat,
    resetChat,
  };
};
