import PocketBase from "pocketbase";
import { PUBLIC_PB_URL } from "$env/static/public";

// User instance
export const pbUser = new PocketBase(PUBLIC_PB_URL);

// Admin instance (if needed)
export const pbAdmin = new PocketBase(PUBLIC_PB_URL);
