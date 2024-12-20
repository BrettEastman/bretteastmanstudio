import { pb } from "$lib/pocketbase";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // Get the auth cookie
  pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

  // Protect chat routes
  if (event.url.pathname.startsWith("/chat")) {
    if (!pb.authStore.isValid) {
      throw redirect(303, "/login");
    }
  }

  const response = await resolve(event);

  // Send the auth cookie back
  response.headers.set(
    "set-cookie",
    pb.authStore.exportToCookie({ httpOnly: false })
  );

  return response;
};
