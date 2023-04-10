import { TMessage, ChatHistory } from "../components/ChatHistory";
import { useRef, useState } from "react";
import { useMessages } from "@/helpers/useMessages";
import { Message } from "@/components/Message";
import { INITIAL_GREETING } from "@/helpers/constants";
import Head from "next/head";

const getResponseFromBot = async (message: string) => {
  const response = await fetch(`/api/hello?message=${message}`);
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

  const handleAddNewMessage = (text: string, user: TMessage["user"]) => {
    addMessageToHistory({ text, user });
    if (user === "bot") {
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
    const botResponse = await getResponseFromBot(input);
    scrollToBottom();
    handleAddNewMessage(botResponse, "bot");
    scrollToBottom();
  };

  return (
    <>
      <Head>
        <title>Heart Mender 💔 - ❤️‍🩹</title>
      </Head>
      <nav className="text-xl font-bold px-8 py-4 bg-slate-50 w-full text-center text-slate-500 rounded-sm sticky top-0 backdrop-blur-3xl bg-opacity-50">
        Heart Mender 💔 - ❤️‍🩹
      </nav>
      <main
        ref={chatContainerRef}
        className="flex min-h-screen max-w-lg mx-auto flex-col items-center gap-4 p-4"
      >
        <ChatHistory>
          <Message user="bot">{INITIAL_GREETING} </Message>
          {chatHistory?.map((message) => (
            <Message key={message.timestamp} user={message.user}>
              {message.text}
            </Message>
          ))}
          {fetching && (
            <Message user="bot">
              <p className="animate-ping">...</p>
            </Message>
          )}
        </ChatHistory>
      </main>
      <div className="flex items-center gap-2 px-8 py-4 bg-slate-50 w-full flex-col rounded-sm sticky bottom-0 backdrop-blur-3xl bg-opacity-50">
        <textarea
          className="w-full p-2 border-2 border-gray-300 rounded-md max-w-screen-md"
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
            disabled={!input}
            className="bg-blue-500 text-white px-4 rounded-md disabled:opacity-50"
          >
            Submit
          </button>
          <button
            className="text-slate-700 p-2 rounded-md disabled:opacity-50"
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
