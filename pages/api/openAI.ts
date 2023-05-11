// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PROMPTS, TPersonas, UNSURE_RESPONSE } from "@/helpers/constants";
import { TApiResponseBody, TChatHistory } from "@/helpers/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import {
  Configuration,
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
  OpenAIApi,
} from "openai";

export const config = {
  runtime: "edge",
};

const apiKey = process.env.CHAT_GPT_API_KEY;
const configuration = new Configuration({ apiKey });
const openai = new OpenAIApi(configuration);

// TODO(iprokopovich): can I use tRPC to keep types in sync?
interface IReqestBody {
  messages: TChatHistory;
  persona: TPersonas;
}

const openAi = async (payload: CreateChatCompletionRequest) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as CreateChatCompletionResponse;

  console.log({ data });
  return data;
};

const buildApiResponse = (message: TApiResponseBody, status: number) =>
  NextResponse.json(message, { status });

export default async function handler(req: NextRequest): Promise<NextResponse> {
  const { messages, persona } = (await req.json()) as IReqestBody;

  console.log({ configuration });

  console.info({ messages });

  if (!messages) {
    return buildApiResponse("You need to send me something to work with", 400);
  } else {
    try {
      const prevMessages = messages.map(({ content, role }) => ({
        content,
        role,
      }));

      const completion = await openAi({
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

      console.info({ completion });

      const bestReply =
        completion.choices[0].message?.content ?? UNSURE_RESPONSE;

      console.info({ bestReply });

      return buildApiResponse(bestReply, 200);
    } catch (error) {
      console.error({ error });
      return buildApiResponse("Internal Server Error", 500);
    }
  }
}
