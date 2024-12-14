import { pb } from "$lib/pocketbase";
import type { Handle } from "@sveltejs/kit";
import type { ClientResponseError } from "pocketbase";

export const handle: Handle = async ({ event, resolve }) => {
  // BEFORE
  // Load the authentication state from the cookies in the incoming request.
  // If no cookie is found, an empty string is used, which effectively means no auth state.
  pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

  // Check if user is logged in
  if (pb.authStore.isValid) {
    try {
      // Attempt to refresh the authentication token for the user.
      // This is typically done to ensure the user session remains active.
      await pb.collection("users").authRefresh();
    } catch (error) {
      const err = error as ClientResponseError;

      // // If the error is not a 401 Unauthorized error, log it as unexpected. Not sure why, but this 401 error kept popping up although the user is logged in.
      // if (err.status !== 401) {
      //   console.error("Unexpected error refreshing auth:", err);
      // }
      console.error("hook.server.ts error:", err);

      // Clear the authentication state, effectively logging the user out.
      // ?? why is this here?
      // pb.authStore.clear();
    }
  }

  // in SvelteKit, there is a special backend locals property that you can use to pass context to our backend handler, called request.locals
  // that is available to all routes and pages
  event.locals.pb = pb;
  // Note that the user model is a record object, so we need to convert it to a plain object so that SvelteKit can serialize it to JSON
  event.locals.user = structuredClone(pb.authStore.model);

  console.log("AuthStore isValid (server):", pb.authStore.isValid);
  console.log("AuthStore model (server):", pb.authStore.model);
  // console.log("Cookies in request:", event.request.headers.get("cookie"));

  const response = await resolve(event);

  // AFTER
  // console.log("Before setting cookie:", event.request.headers.get("cookie"));
  response.headers.set(
    "set-cookie",
    pb.authStore.exportToCookie({ httpOnly: false, path: "/" })
  );
  // console.log("After setting cookie:", response.headers.get("set-cookie"));
  return response;
};
