import PocketBase from "pocketbase";
import { PUBLIC_PB_URL } from "$env/static/public";

let cachedPb: PocketBase | null = null;

export function createPocketBaseInstance() {
  // Return cached instance if it exists
  if (cachedPb) {
    return cachedPb;
  }

  // Initialize PocketBase based on the environment
  if (typeof window !== "undefined") {
    // Browser - create a new instance
    cachedPb = new PocketBase(PUBLIC_PB_URL);
    
    // Try to load any existing auth data from localStorage
    const authData = localStorage.getItem('pocketbase_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        cachedPb.authStore.save(parsed.token, parsed.model);
      } catch (e) {
        console.error('Failed to restore auth state:', e);
        localStorage.removeItem('pocketbase_auth');
      }
    }
  } else {
    // Server - create a new instance for each request
    cachedPb = new PocketBase(PUBLIC_PB_URL);
    cachedPb.authStore.clear(); // Ensure clean auth state
  }

  return cachedPb;
}
