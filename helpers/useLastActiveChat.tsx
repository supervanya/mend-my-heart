import { useLocalStorage } from "usehooks-ts";
import { TPersonas } from "./constants";

const LS_KEY = "lastActiveChat";

export const useLastActiveChat = () => {
  const [lastActiveChat, setLastActiveChat] = useLocalStorage<TPersonas>(
    LS_KEY,
    "lifeCoach"
  );

  return {
    lastActiveChat,
    setLastActiveChat,
  };
};
