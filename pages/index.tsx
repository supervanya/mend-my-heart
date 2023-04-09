import { ChatHistory, Message } from "../components/ChatHistory";
import { useRef, useState } from "react";
import { useMessages } from "@/helpers/useMessages";

const sampleChatHistory: ChatHistory = [
  {
    text: "Hi I am a Heart Mender, I can help you talk though some of your feelings. I can't promise I will help but studies show that talking about your feelings, even to an inanimate object or a stupid chatbot like me can help you feel better.",
    timestamp: 1629200000000,
    user: "bot",
  },
  {
    text: "So what's going on ?",
    timestamp: 1629200000000,
    user: "user",
  },
];

const addMessageToHistory = (message: string, chatHistory: ChatHistory) => {
  const newMessage: Message = {
    text: message,
    timestamp: Date.now(),
    user: "user",
  };
  return [...chatHistory, newMessage];
};

export default function Home() {
  const [input, setInput] = useState<string>("");
  const { chatHistory, updateChatHistory } = useMessages();

  const handleSubmit = () => {
    if (input) {
      const newHistory = addMessageToHistory(input, chatHistory ?? []);
      updateChatHistory(newHistory);
      setInput("");
    }
  };

  return (
    <main className="flex min-h-screen max-w-2xl mx-auto flex-col items-center gap-2 p-24">
      <p className="text-base text-gray-500">
        Hi I am a Heart Mender, I can help you talk though some of your
        feelings. I can`t promise I will help but studies show that talking
        about your feelings, even to an inanimate object or a stupid chatbot
        like me can help you feel better.
      </p>
      <div className="w-full">
        {!chatHistory ? (
          <p className="text-2xl font-bold">
            So what`s going on <span className="animate-pulse">?</span>
          </p>
        ) : (
          <ChatHistory chatHistory={chatHistory} />
        )}
      </div>
      <textarea
        className="w-full p-2 border-2 border-gray-300 rounded-md"
        aria-multiline="true"
        placeholder="Tell me in as much details as you would like, but the more the better..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!input}
          className="bg-blue-500 text-white px-4 rounded-md disabled:opacity-50"
        >
          Submit
        </button>
        <button
          className="text-slate-700 p-2 rounded-md disabled:opacity-50"
          disabled={!chatHistory}
          // TODO(iprokopovich): add a confirmation dialog and clear api context
          onClick={() => updateChatHistory([])}
        >
          Start Over
        </button>
      </div>
    </main>
  );
}
