"use client";
import { ChatHistory } from "@/components/ChatHistory";
import { useRef, useState } from "react";
import { useMessages } from "@/helpers/useMessages";
import { Message } from "@/components/Message";
import { PROMPTS, TPersonas } from "@/helpers/constants";
import Head from "next/head";
import { TUser } from "@/helpers/types";
import { waitASecond } from "@/helpers/helpers";
import { AnimatedSpeech } from "@/components/AnimatedSpeech";
import { toPairs } from "lodash";
import { usePersona } from "@/helpers/useLastActiveChat";
import { apiClient } from "@/helpers/apiClient";
import { messagesDb } from "@/db";

export default function Home() {
  const chatRef = useRef<HTMLDivElement>(null);
  const [fetching, setFetching] = useState(false);
  const [input, setInput] = useState<string>("");

  const { persona, personaName, setPersona } = usePersona();
  const { greeting, oneLiner, colors } = persona;

  const {
    chat: chatHistory,
    addMessageToHistory,
    resetChat: resetChatHistory,
  } = useMessages(personaName);

  const scrollToBottom = () => {
    const container = chatRef.current;
    if (container) {
      setTimeout(() => {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }, 200);
    }
  };

  const handleAddNewMessage = (text: string, user: TUser) => {
    addMessageToHistory({ content: text, role: user });
    if (user === "assistant") {
      setFetching(false);
    } else {
      setInput("");
    }
    return text;
  };

  const handleSubmit = async () => {
    if (!input) {
      return;
    }
    handleAddNewMessage(input, "user");
    scrollToBottom();

    await waitASecond();
    setFetching(true);
    scrollToBottom();

    // waiting a bit for dramatic effect
    await waitASecond();
    const botResponse = await apiClient.getResponseFromBot(
      chatHistory,
      input,
      personaName
    );
    handleAddNewMessage(botResponse, "assistant");
    scrollToBottom();
  };

  return (
    <>
      <Head>
        <title>Life Journey Sage</title>
      </Head>

      <div
        style={{ backgroundColor: colors.background }}
        className={`flex h-[100dvh] flex-col overflow-auto overscroll-none transition-colors duration-500`}
        ref={chatRef}
      >
        <nav
          style={{ backgroundColor: colors.dark }}
          className="sticky top-0 z-10 w-full rounded-sm bg-slate-600 px-8 py-4 text-center text-white backdrop-blur-3xl"
        >
          <div className="flex flex-col items-center gap-2">
            <select
              value={personaName}
              className="rounded-md bg-slate-700 p-1 text-white"
              onChange={({ target }) => setPersona(target.value as TPersonas)}
            >
              {toPairs(PROMPTS).map(([persona, settings]) => (
                <option key={persona} value={persona}>
                  {settings.name}
                </option>
              ))}
            </select>

            <span className="text-base text-slate-100">{oneLiner}</span>

            <span className="text-xs text-slate-300">
              Remember, I am just a silly robot
            </span>
          </div>
        </nav>

        <main className="mx-auto flex max-w-lg flex-1 flex-col items-center gap-4 p-4">
          <ChatHistory>
            <Message
              key={`greeting-${persona.name}`}
              role="assistant"
              index={0}
            >
              {greeting}
            </Message>

            {chatHistory?.map((message, i) => (
              <Message
                key={message.timestamp + persona.name}
                role={message.role}
                index={i + 1}
              >
                {message.content}
              </Message>
            ))}

            {fetching && (
              <Message role="assistant" index={chatHistory.length + 1}>
                <AnimatedSpeech />
              </Message>
            )}
          </ChatHistory>
        </main>

        <footer className="sticky bottom-0 flex w-full flex-col items-center gap-2 rounded-sm bg-slate-700 bg-opacity-50 px-8 py-4 backdrop-blur-3xl">
          <textarea
            className="w-full max-w-screen-md rounded-md border-2 border-gray-300 p-2 text-slate-800"
            aria-multiline="true"
            placeholder="Tell me in as much details as you would like, but the more the better..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!input || fetching}
              className="rounded-md bg-blue-500 px-4 text-white disabled:opacity-50"
            >
              {fetching ? "Thinking..." : "Submit"}
            </button>
            <button
              className="rounded-md p-2 text-slate-200 disabled:opacity-50"
              disabled={!chatHistory}
              onClick={resetChatHistory}
            >
              Start Over
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
