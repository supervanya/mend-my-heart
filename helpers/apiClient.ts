import { TPersonas } from "./constants";
import { combineMessages } from "./helpers";
import { TApiRequestBody, TChatHistory } from "./types";

const getResponseFromBot = async (
  history: TChatHistory,
  newQuestion: string,
  persona: TPersonas
) => {
  // return `Still in development persona: ${persona}, newQuestion: ${newQuestion}`;
  const messages = combineMessages(history, newQuestion, "user");
  const payload: TApiRequestBody = { messages, persona };
  const response = await fetch(`/api/openAI`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  try {
    if (response.status !== 200) {
      throw new Error(
        `received ${response.status} status code from /api/openAI`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error parsing response from /api/openAI", error);
    return "Sorry, I am having trouble understanding you. Maybe try again later?";
  }
};

export const apiClient = {
  getResponseFromBot,
};
