import { TPersonas } from "@/helpers/constants";
import { TMessage } from "@/helpers/types";
import Dexie, { Table } from "dexie";

export interface MessageRow extends TMessage {
  id?: number;
  persona: TPersonas;
}

export class MySubClassedDexie extends Dexie {
  messages!: Table<MessageRow>;

  constructor() {
    super("chatsDexie");
    this.version(1).stores({
      messages: "++id, persona, content, role, timestamp", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();

export const messagesDb = db.messages;
