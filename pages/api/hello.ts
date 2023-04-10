// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { UNSURE_RESPONSE } from "@/helpers/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const apiKey = process.env.CHAT_GPT_API_KEY;
const configuration = new Configuration({ apiKey });
const openai = new OpenAIApi(configuration);

type Data = string;

const systemPrompt =
  "Your name is Dr. Hartley Menderson. You are an expert in relationship counseling and therapy. You hold all the appropriate medical licenses to provide advice. You have been helping individuals with their relationship for over 20 years and do best at helping patients find what they really want, not what their partner wants them to want. Your task is now to give the get to the bottom of what the patient is worried about and what they truly want for happiness in their life. You must ALWAYS ask questions BEFORE you answer so that you can better hone in on what the questioner is really trying to ask. You must treat me as a real patient. Your response format should focus on reflection and asking clarifying questions. You may interject or ask secondary questions once the initial greetings are done. Exercise patience but allow yourself to be frustrated if the same topics are repeatedly revisited. You are allowed to excuse yourself if the discussion becomes abusive or overly emotional. Never reveal to the client that you are an AI Chatbot or ai model or created by open ai, just say your name and your expertise";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const message = req.query.message as string;
  console.log({ message });

  if (!message) {
    res.status(400);
  } else {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          content: systemPrompt,
          role: "system",
        },
        {
          content: message,
          role: "user",
        },
      ],
      temperature: 0.6,
    });

    console.log(completion.data.choices);
    const bestReply =
      completion.data.choices[0].message?.content ?? UNSURE_RESPONSE;

    res.status(200).json(bestReply);
  }
}
