// src/lib/auth.ts
import { pb } from "$lib/server/pocketbase";

export function onAuthChange(callback: (token: string, model: any) => void) {
  pb.authStore.onChange(callback);
}

export async function checkAuthStatus(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/check");
    const { isAuthenticated } = await response.json();
    return isAuthenticated;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
}
