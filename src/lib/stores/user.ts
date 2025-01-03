import { writable } from "svelte/store";

export const currentUserId = writable<string | null>(null);
