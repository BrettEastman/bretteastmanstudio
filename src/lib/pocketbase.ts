import PocketBase from "pocketbase";

export function createPocketBaseInstance() {
  if (typeof window !== "undefined") {
    // Keep existing browser-side caching logic? Research if this is the best approach
    if (window.__pocketbaseInstance) {
      return window.__pocketbaseInstance;
    }

    const pb = new PocketBase("https://api.bretteastmanstudio.com");
    window.__pocketbaseInstance = pb;

    // Restore auth from localStorage if present
    const authData = localStorage.getItem("pocketbase_auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        pb.authStore.save(parsed.token, parsed.model);
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        localStorage.removeItem("pocketbase_auth");
      }
    }

    return pb;
  }

  // Server - ALWAYS create a new instance (no caching)
  return new PocketBase("https://api.bretteastmanstudio.com");
}
