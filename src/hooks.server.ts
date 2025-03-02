import { redirect, type Handle } from "@sveltejs/kit";
import { createPocketBaseInstance } from "$lib/pocketbase";

export const handle: Handle = async ({ event, resolve }) => {
  // Create new PocketBase instance for each request
  const pb = createPocketBaseInstance();
  const cookie = event.request.headers.get("cookie") || "";

  pb.authStore.loadFromCookie(cookie);

  try {
    if (pb.authStore.isValid) {
      try {
        await pb.collection("users").authRefresh();
        event.locals.pb = pb;
        event.locals.user = structuredClone(pb.authStore.model);
      } catch (err) {
        // Only clear auth if it's a real authentication error
        // @ts-expect-error - accessing error status
        if (err?.status === 401) {
          console.error("Auth refresh failed with 401, clearing auth:", err);
          event.locals.pb = pb;
          event.locals.user = null;
          pb.authStore.clear();

          // Create a new response object to set the cookie
          const response = await resolve(event);

          // Clear the cookie by setting it with an expiration date in the past
          const cookieOptions = {
            secure: import.meta.env.PROD,
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
          };

          response.headers.set(
            "set-cookie",
            pb.authStore.exportToCookie(cookieOptions)
          );
          // cache control headers still needed?
          response.headers.set("Cache-Control", "no-store, must-revalidate");
          response.headers.set("Pragma", "no-cache");
          response.headers.set("Expires", "0");
        } else {
          console.warn(
            "Non-auth error during refresh, keeping auth state:",
            err
          );
          event.locals.pb = pb;
          event.locals.user = structuredClone(pb.authStore.model);
        }
      }
    } else {
      event.locals.pb = pb;
      event.locals.user = null;
    }
  } catch (err) {
    console.error("Error in auth handling:", err);
    pb.authStore.clear();
    event.locals.pb = pb;
    event.locals.user = null;
  }

  // only allow access to /chat if user authenticated
  if (event.url.pathname.startsWith("/chat")) {
    if (!pb.authStore.isValid) {
      throw redirect(303, "/login");
    }
  }

  const response = await resolve(event);

  return response;
};
