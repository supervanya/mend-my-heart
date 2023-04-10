import { TChatHistory, TMessage, ChatHistory } from "../components/ChatHistory";
import { useRef, useState } from "react";
import { useMessages } from "@/helpers/useMessages";
import { Message } from "@/components/Message";
import { INITIAL_GREETING } from "@/helpers/constants";
import Head from "next/head";

const addMessageToHistory = (
  message: Pick<TMessage, "text" | "user">,
  chatHistory: TChatHistory
) => {
  const newMessage: TMessage = {
    text: message.text,
    timestamp: Date.now().toString(),
    user: message.user,
  };
  return [...chatHistory, newMessage];
};

export default function Home() {
  const chatContainerRef = useRef<HTMLElement | null>(null);
  const [input, setInput] = useState<string>("");
  const { chatHistory, addMessageToHistory, resetChatHistory } = useMessages();

  const updateUserMessage = async () => {
    if (input) {
      handleNewMessage(input, "user");
      setInput("");
    }
  };

  const getResponseFromBot = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "Hello, I am a bot.";
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleNewMessage = (message: string, user: TMessage["user"]) => {
    addMessageToHistory({ text: message, user });
    scrollToBottom();
  };

  const handleSubmit = async () => {
    if (!input) {
      return;
    }

    await updateUserMessage();
    const botResponse = await getResponseFromBot();
    handleNewMessage(botResponse, "bot");
    scrollToBottom();
  };

  return (
    <>
      <Head>
        <title>Heart Mender 💔 -{">"} ❤️‍🩹</title>
      </Head>
      <nav className="text-xl font-bold px-8 py-4 bg-slate-50 w-full text-center text-slate-600 rounded-sm sticky top-0 backdrop-blur-3xl bg-opacity-50">
        Heart Mender 💔 {"->"} ❤️‍🩹
      </nav>
      <main
        ref={chatContainerRef}
        className="flex min-h-screen max-w-lg mx-auto flex-col items-center gap-4 pt-8 p-4 mb-8"
      >
        <ChatHistory>
          <Message
            text={INITIAL_GREETING}
            timestamp={new Date().toISOString()}
            user="bot"
          />
          {chatHistory?.map((message) => (
            <Message
              key={message.timestamp}
              text={message.text}
              timestamp={message.timestamp}
              user={message.user}
            />
          ))}
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
