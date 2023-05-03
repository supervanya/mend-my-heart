import { TMessage } from "@/helpers/types";
import { motion } from "framer-motion";
import { forwardRef } from "react";

const LineSplitter: React.FC<{ children: string }> = ({ children }) => {
  return (
    <>
      {children.split("\n").map((line, i) => (
        <span key={i}>
          {line} <br />
        </span>
      ))}
    </>
  );
};

type MessageProps = Pick<TMessage, "role"> & {
  index: number;
  children: React.ReactNode;
};

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  (props, ref) => {
    const { children, role, index } = props;
    const color =
      role === "assistant"
        ? "bg-gradient-to-bl from-[#5b5d60] to-[#81848c]"
        : "bg-gradient-to-br from-[#0188ef] to-[#6fbeff]";
    const align = role === "assistant" ? "justify-start" : "justify-end";
    const margin = role === "assistant" ? "mr-2" : "ml-2";

    return (
      <motion.div
        ref={ref}
        className={`flex w-full text-base ${align} ${margin}`}
        layout
        initial={{
          opacity: 0,
          y: "100%",
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: "-100%",
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
          delay: index * 0.025,
          layout: {
            // duration: index * 0.55,
          },
        }}
      >
        <p
          className={`${color} format max-w-xs rounded-2xl px-4 py-2.5 text-white md:max-w-md`}
        >
          {typeof children === "string" ? (
            <LineSplitter>{children}</LineSplitter>
          ) : (
            children
          )}
        </p>
        {/* TODO(iprokopovich): add timestamp */}
        {/* <span className="text-xs text-gray-400">
        {new Date(timestamp).toLocaleString()}
      </span> */}
      </motion.div>
    );
  }
);

Message.displayName = "Message";
