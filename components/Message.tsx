import { TMessage } from "@/helpers/types";

const LineSplitter: React.FC<{ children: string }> = ({ children }) => {
  return (
    <>
      {children.split("\n").map((line, i) => (
        <p key={i}>
          {line} <br />
        </p>
      ))}
    </>
  );
};

export const Message: React.FC<
  Pick<TMessage, "role"> & { children: React.ReactNode }
> = ({ children, role }) => {
  const color = role === "assistant" ? "bg-gray-500" : "bg-blue-500";
  const align = role === "assistant" ? "justify-start" : "justify-end";

  return (
    <div className={`flex w-full text-base ${align}`}>
      <p
        className={`${color} format max-w-xs rounded-2xl px-4 py-2 text-white md:max-w-md`}
      >
        {typeof children === "string" ? (
          <LineSplitter>{children}</LineSplitter>
        ) : (
          children
        )}
      </p>
      {/* <span className="text-xs text-gray-400">
        {new Date(timestamp).toLocaleString()}
      </span> */}
    </div>
  );
};
