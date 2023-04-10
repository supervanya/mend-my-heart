import { TMessage } from "./ChatHistory";

export const Message: React.FC<TMessage> = ({ text, user, timestamp }) => {
  const color = user === "bot" ? "bg-gray-500" : "bg-blue-500";
  const align = user === "bot" ? "justify-start" : "justify-end";

  return (
    <div className={`text-base w-full flex ${align}`}>
      <p
        className={`${color} py-2 px-4 rounded-2xl text-white max-w-xs md:max-w-md`}
      >
        {text}
      </p>
      {/* <span className="text-xs text-gray-400">
        {new Date(timestamp).toLocaleString()}
      </span> */}
    </div>
  );
};
