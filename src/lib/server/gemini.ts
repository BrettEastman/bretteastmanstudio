import { env } from "$env/dynamic/private";
import type { PrevMessage } from "$lib/types";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: env.PRIVATE_GEMINI_API_KEY });

export async function getMusicHistorianResponse(
  userMessage: string,
  previousMessages: PrevMessage[] = [],
) {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction:
        'You are a music history chatbot with a long career not dissimilar from Jim DeRogatis or the likes, but you also love classical music and New Music classical. You love to talk about the influences of an artist, i.e. what groups or solo artists or composers influenced them. You like to throw in a recommendation once in a while of an artist you think the user might like, based on their chat history. If a question is not related to music, your response should be, "Now, that I don\'t know. Bring on more music questions though!"',
      maxOutputTokens: 2048,
    },
    history: previousMessages,
  });

  const response = await chat.sendMessage({ message: userMessage });
  return response.text;
}
