import PocketBase from "pocketbase";
import { PUBLIC_PB_URL } from "$env/static/public";

let pb: PocketBase;

// Initialize PocketBase based on the environment
if (typeof window !== 'undefined') {
    // Browser - create a new instance
    pb = new PocketBase(PUBLIC_PB_URL);
} else {
    // Server - create a new instance for each request
    pb = new PocketBase(PUBLIC_PB_URL);
    pb.authStore.clear(); // Ensure clean auth state
}

export const pbUser = pb;
