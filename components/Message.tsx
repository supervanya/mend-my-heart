import { TMessage } from "@/helpers/types";
import { usePersona } from "@/helpers/useLastActiveChat";
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
    const { persona } = usePersona();
    const { colors } = persona;

    const { children, role, index } = props;

    const assistantBackground = `linear-gradient(170deg, ${colors.dark}, ${colors.light})`;
    const userBackground = `linear-gradient(170deg, #0188ef, #6fbeff)`;
    const backgroundColor =
      role === "assistant" ? assistantBackground : userBackground;

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
          style={{ background: backgroundColor }}
          className={`format max-w-xs rounded-2xl px-4 py-2.5 text-white md:max-w-md`}
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
