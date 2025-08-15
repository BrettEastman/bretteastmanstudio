import { json } from "@sveltejs/kit";

export function GET() {
  return json({
    PRIVATE_GEMINI_API_KEY: process.env.PRIVATE_GEMINI_API_KEY,
    all: Object.keys(process.env),
  });
}
