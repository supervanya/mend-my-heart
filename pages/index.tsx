"use client";
import { ChatHistory } from "@/components/ChatHistory";
import { useRef, useState } from "react";
import { useMessages } from "@/helpers/useMessages";
import { Message } from "@/components/Message";
import { INITIAL_GREETING } from "@/helpers/constants";
import Head from "next/head";
import { TChatHistory, TUser } from "@/helpers/types";
import { combineMessages } from "@/helpers/helpers";

const getResponseFromBot = async (
  history: TChatHistory,
  newQuestion: string
) => {
  const messages = combineMessages(history, newQuestion, "user");
  const response = await fetch(`/api/openAI`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await response.json();
  return data;
};

export default function Home() {
  const chatContainerRef = useRef<HTMLElement | null>(null);
  const [fetching, setFetching] = useState(false);
  const [input, setInput] = useState<string>("");
  const { chatHistory, addMessageToHistory, resetChatHistory } = useMessages();

  const scrollToBottom = () => {
    // (iprokopovich)FIXME: this doesn't fully work
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
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

    setFetching(true);
    scrollToBottom();
    const botResponse = await getResponseFromBot(chatHistory, input);
    scrollToBottom();
    handleAddNewMessage(botResponse, "assistant");
    scrollToBottom();
  };

  return (
    <>
      <Head>
        <title>Heart Mender 💔 - ❤️‍🩹</title>
      </Head>
      <nav className="sticky top-0 w-full rounded-sm bg-slate-50 bg-opacity-50 px-8 py-4 text-center text-xl font-bold text-slate-500 backdrop-blur-3xl">
        Heart Mender 💔 - ❤️‍🩹
      </nav>
      <main
        ref={chatContainerRef}
        className="mx-auto flex min-h-screen max-w-lg flex-col items-center gap-4 p-4"
      >
        <ChatHistory>
          <Message role="assistant">{INITIAL_GREETING} </Message>
          {chatHistory?.map((message) => (
            <Message key={message.timestamp} role={message.role}>
              {message.content}
            </Message>
          ))}
          {fetching && (
            <Message role="assistant">
              <p className="animate-ping">...</p>
            </Message>
          )}
        </ChatHistory>
      </main>
      <div className="sticky bottom-0 flex w-full flex-col items-center gap-2 rounded-sm bg-slate-50 bg-opacity-50 px-8 py-4 backdrop-blur-3xl">
        <textarea
          className="w-full max-w-screen-md rounded-md border-2 border-gray-300 p-2"
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
            className="rounded-md p-2 text-slate-700 disabled:opacity-50"
            disabled={!chatHistory}
            onClick={resetChatHistory}
          >
            Start Over
          </button>
        </div>
      </div>
    </>
  );
}
