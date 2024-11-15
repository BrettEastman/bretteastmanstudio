import PocketBase from "pocketbase";
import { PB_URL } from "$env/static/private";

export const pb = new PocketBase(PB_URL);

// Types for our collections
export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  response: string;
  created: string;
}
