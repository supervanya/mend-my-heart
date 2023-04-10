export type TMessage = {
  text: string;
  user: string | "bot";
  timestamp: string;
};

export type TChatHistory = TMessage[];

export const ChatHistory: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* {chatHistory.map((message) => (
        <div
          key={message.timestamp}
          className={`flex gap-2 ${
            message.user === "bot" ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`p-2 rounded-md ${
              message.user === "bot"
                ? "bg-gray-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {message.text}
          </div>
        </div>
      ))} */}
      {children}
    </div>
  );
};
