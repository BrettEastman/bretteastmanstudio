import { pb } from "$lib/pocketbase";
import type { Handle } from "@sveltejs/kit";
import type { ClientResponseError } from "pocketbase";

export const handle: Handle = async ({ event, resolve }) => {
  // BEFORE
  pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");
  if (pb.authStore.isValid) {
    try {
      await pb.collection("users").authRefresh();
    } catch (error) {
      const err = error as ClientResponseError;
      if (err.status !== 401) {
        console.error("Unexpected error refreshing auth:", err);
      }
      pb.authStore.clear();
    }
  }

  // in SvelteKit, there is a special backend locals property that you can use to pass context to our backend handler, called request.locals
  // that is available to all routes and pages
  event.locals.pb = pb;
  // Note that the user model is a record object, so we need to convert it to a plain object so that SvelteKit can serialize it to JSON
  event.locals.user = structuredClone(pb.authStore.model);

  const response = await resolve(event);

  // AFTER
  response.headers.set(
    "set-cookie",
    pb.authStore.exportToCookie({ httpOnly: false })
  );
  return response;
};
