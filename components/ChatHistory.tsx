export type Message = {
  text: string;
  user: string;
  timestamp: number;
};

export type ChatHistory = Message[];

export const ChatHistory: React.FC<{ chatHistory: Message[] }> = ({
  chatHistory,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {chatHistory.map((message) => (
        <div
          key={message.timestamp}
          className={`flex gap-2 ${
            message.user === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`p-2 rounded-md ${
              message.user === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
};
