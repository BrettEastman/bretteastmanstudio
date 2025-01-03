// import { pbUser, pbAdmin } from "$lib/pocketbase";
import { pbUser } from "$lib/pocketbase";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  console.log("Request received:", event.url.pathname);
  // Clear admin credentials if previously set
  // pbUser.authStore.clear();
  // pbAdmin.authStore.clear();
  // Get the auth cookie
  pbUser.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

  // Protect chat routes
  if (event.url.pathname.startsWith("/chat")) {
    if (!pbUser.authStore.isValid) {
      throw redirect(303, "/login");
    }
  }

  if (pbUser.authStore.isValid) {
    console.log(
      "pbUser.authStore.model from hooks server:",
      pbUser.authStore.model
    );
    event.locals.user = structuredClone(pbUser.authStore.model);
  } else {
    event.locals.user = null;
  }

  const response = await resolve(event);

  // Send the auth cookie back
  response.headers.set(
    "set-cookie",
    pbUser.authStore.exportToCookie({ httpOnly: false, path: "/" })
  );

  return response;
};
