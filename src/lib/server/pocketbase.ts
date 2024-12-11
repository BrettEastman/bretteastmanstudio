import PocketBase from "pocketbase";
import { PB_URL } from "$env/static/private";

export const pb = new PocketBase(PB_URL);
