import { TChatHistory, TMessage, ChatHistory } from "../components/ChatHistory";
import { useRef, useState } from "react";
import { useMessages } from "@/helpers/useMessages";
import { Message } from "@/components/Message";
import { INITIAL_GREETING } from "@/helpers/constants";

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
  const [input, setInput] = useState<string>("");
  const { chatHistory, addMessageToHistory, resetChatHistory } = useMessages();

  const updateUserMessage = async () => {
    if (input) {
      addMessageToHistory({ text: input, user: "user" });
      setInput("");
    }
  };

  const getResponseFromBot = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "Hello, I am a bot.";
  };

  const handleSubmit = async () => {
    if (!input) {
      return;
    }

    await updateUserMessage();
    const botResponse = await getResponseFromBot();
    addMessageToHistory({ text: botResponse, user: "bot" });
  };

  return (
    <main className="flex min-h-screen max-w-2xl mx-auto flex-col items-center gap-4 p-24">
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

      <textarea
        className="w-full p-2 border-2 border-gray-300 rounded-md"
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
      <div className="flex gap-2">
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
    </main>
  );
}
