import { useLocalStorage } from "react-use";
import { PROMPTS, TPersonas } from "./constants";

const LS_KEY = "lastActiveChat";

export const usePersona = () => {
  const [personaNameLs, setPersona] = useLocalStorage<TPersonas>(
    LS_KEY,
    "lifeCoach"
  );

  const personaName = personaNameLs ?? "lifeCoach";

  return {
    personaName,
    persona: PROMPTS[personaName],
    setPersona,
  };
};
