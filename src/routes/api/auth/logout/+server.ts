import { createPocketBaseInstance } from "$lib/pocketbase";
import { json } from "@sveltejs/kit";

export async function POST({ cookies }) {
  cookies.delete("pb_auth", { path: "/" });

  const pbUser = createPocketBaseInstance();
  pbUser.authStore.clear();
  const response = json({ message: "Logout successful", success: true });

  // Set cache control headers
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  // Clear the cookie with a single header
  response.headers.set(
    "set-cookie",
    `pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly; ${
      import.meta.env.PROD ? "secure; " : ""
    }sameSite=lax`
  );

  return response;
}
