import PocketBase from "pocketbase";
import { PUBLIC_PB_URL } from "$env/static/public";

export function createPocketBaseInstance() {
  // Browser - use cache
  if (typeof window !== "undefined") {
    // Keep your existing browser-side caching logic
    if (window.__pocketbaseInstance) {
      return window.__pocketbaseInstance;
    }

    const pb = new PocketBase(PUBLIC_PB_URL);
    window.__pocketbaseInstance = pb;

    // Restore auth from localStorage if present
    const authData = localStorage.getItem("pocketbase_auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        pb.authStore.save(parsed.token, parsed.model);
      } catch (e) {
        console.error("Failed to restore auth state:", e);
        localStorage.removeItem("pocketbase_auth");
      }
    }

    return pb;
  }

  // Server - ALWAYS create a new instance (no caching)
  return new PocketBase(PUBLIC_PB_URL);
}
