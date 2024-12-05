import PocketBase from "pocketbase";
import { PB_URL } from "$env/static/private";
import { writable } from "svelte/store";

export const pb = new PocketBase(PB_URL);

export const currentUser = writable(pb.authStore.model);
