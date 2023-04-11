export const ChatHistory: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="flex w-full flex-col gap-2">{children}</div>;
};
