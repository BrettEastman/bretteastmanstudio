import { pbUser } from "$lib/pocketbase";
import { json } from "@sveltejs/kit";

export async function POST({ cookies }) {
  // Clear the PocketBase auth cookie
  cookies.delete("pb_auth", { path: "/" });

  pbUser.authStore.clear();
  const response = json({ message: "Logout successful", success: true });

  // Set cache control headers
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  // Clear the cookie with a single, well-formed header
  response.headers.set(
    "set-cookie",
    `pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly; ${
      import.meta.env.PROD ? "secure; " : ""
    }sameSite=lax`
  );

  return response;
}
