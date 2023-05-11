import { db } from "@/db";
import { TPersonas } from "./constants";
import { TChatHistory, TMessage } from "./types";
import { useEffectOnce } from "react-use";
import { useLiveQuery } from "dexie-react-hooks";
import { isArray } from "lodash";

const hasMigrated = (key: string) => {
  const hasMigrated = localStorage.getItem(key);
  return hasMigrated !== null;
};

const migrateV1 = () => {
  // this was used with the initial release of the app
  const HAS_MIGRATED_KEY = "hasMigratedV1";
  if (hasMigrated(HAS_MIGRATED_KEY)) {
    return;
  }

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
        (parsed as TChatHistory).forEach((message) => {
          db.messages.add({ ...message, persona: OLD_PERSONA });
        });

        localStorage.setItem(HAS_MIGRATED_KEY, new Date().toISOString());
        console.warn("Migration successful");

        // localStorage.removeItem(OLD_KEY);
      }
    }
  } catch (error) {
    console.error("Error migrating old chat history", error);
  }
};

const migrateV2 = () => {
  const HAS_MIGRATED_KEY = "hasMigratedV2";
  debugger;
  if (hasMigrated(HAS_MIGRATED_KEY)) {
    return;
  }

  const personasToMigrate: TPersonas[] = ["lifeCoach", "relationshipTherapist"];

  try {
    personasToMigrate.forEach((persona) => {
      const prevChatHistory = localStorage.getItem(persona);
      if (!prevChatHistory) {
        return;
      }
      const parsed = JSON.parse(prevChatHistory) as TChatHistory;

      console.log({ prevChatHistory, parsed, persona });

      if (prevChatHistory && isArray(parsed)) {
        console.warn("Migrating old chat history to new format", parsed);
        (parsed as TChatHistory).forEach((message) => {
          db.messages.add({ ...message, persona });
        });
      }
    });
    localStorage.setItem(HAS_MIGRATED_KEY, new Date().toISOString());
    console.warn("Migration successful");
  } catch (error) {
    console.error("Error migrating old chat history", error);
  }
};

const runMigrations = () => {
  migrateV1();
  migrateV2();
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
