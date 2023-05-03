import { AnimatePresence } from "framer-motion";

export const ChatHistory: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex h-full w-full flex-col gap-2 ">
    <AnimatePresence mode="popLayout">{children}</AnimatePresence>
  </div>
);
