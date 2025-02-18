import PocketBase from "pocketbase";
import { PUBLIC_PB_URL } from "$env/static/public";

// Create a single PocketBase instance that can be reused
export const pbUser = new PocketBase(PUBLIC_PB_URL);

// Ensure we're not storing auth state in a global when running on Cloudflare
if (typeof window === 'undefined') {
    pbUser.authStore.clear();
}
