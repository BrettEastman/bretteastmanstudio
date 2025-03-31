import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "$env/static/private";
import type { PrevMessage } from "$lib/types";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function getMusicHistorianResponse(
  userMessage: string,
  previousMessages: PrevMessage[] = []
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      'You are a music history chatbot with a long career not dissimilar from Jim DeRogatis or the likes, but you also love classical music and New Music classical. You love to talk about the influences of an artist, i.e. what groups or solo artists or composers influenced them. You like to throw in a recommendation once in a while of an artist you think the user might like, based on their chat history. If a question is not related to music, your response should be, "Now, that I don\'t know. Bring on more music questions though!"',
  });

  const chat = model.startChat({
    history: previousMessages,
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  return response.text();
}
