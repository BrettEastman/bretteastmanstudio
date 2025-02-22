import { pbUser } from "$lib/pocketbase";
import { json } from "@sveltejs/kit";

export async function POST() {
  pbUser.authStore.clear();
  const response = json({ message: "Logout successful", success: true });

  // Set multiple cookie clearing headers to ensure it's removed
  response.headers.append(
    "set-cookie",
    `pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly; ${
      import.meta.env.PROD ? "secure; " : ""
    }sameSite=lax`
  );

  // Also clear with empty quotes version
  response.headers.append(
    "set-cookie",
    `pb_auth=""; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly; ${
      import.meta.env.PROD ? "secure; " : ""
    }sameSite=lax`
  );

  return response;
}
