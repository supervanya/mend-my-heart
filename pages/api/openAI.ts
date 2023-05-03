// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PROMPTS, TPersonas, UNSURE_RESPONSE } from "@/helpers/constants";
import { TChatHistory } from "@/helpers/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const apiKey = process.env.CHAT_GPT_API_KEY;
const configuration = new Configuration({ apiKey });
const openai = new OpenAIApi(configuration);

interface IReqestBody {
  messages: TChatHistory;
  persona: TPersonas;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { messages, persona } = req.body as IReqestBody;

  console.log({ messages });

  if (!messages) {
    res.status(400);
  } else {
    try {
      const prevMessages = messages.map(({ content, role }) => ({
        content,
        role,
      }));
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        messages: [
          {
            content: PROMPTS[persona].systemPrompt,
            role: "system",
          },
          ...prevMessages,
        ],
      });

      const bestReply =
        completion.data.choices[0].message?.content ?? UNSURE_RESPONSE;

      res.status(200).json(bestReply);
    } catch (error) {
      res.status(500).json("Internal Server Error");
    }
  }
}
