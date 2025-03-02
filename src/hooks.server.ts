import { redirect, type Handle } from "@sveltejs/kit";
import { createPocketBaseInstance } from "$lib/pocketbase";

export const handle: Handle = async ({ event, resolve }) => {
  // Create a fresh PocketBase instance for each request
  const pb = createPocketBaseInstance();
  const cookie = event.request.headers.get("cookie") || "";
  console.log("Auth cookie present:", !!cookie);
  console.log("Request path:", event.url.pathname);
  console.log(
    "Environment:",
    import.meta.env.PROD ? "production" : "development"
  );

  pb.authStore.loadFromCookie(cookie);
  console.log("Auth store loaded, isValid:", pb.authStore.isValid);
  console.log("Auth token exists:", !!pb.authStore.token);

  try {
    if (pb.authStore.isValid) {
      try {
        await pb.collection("users").authRefresh();
        event.locals.pb = pb;
        event.locals.user = structuredClone(pb.authStore.model);
        console.log("Auth refresh successful, user:", event.locals.user?.id);
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
          // Add cache control headers
          response.headers.set("Cache-Control", "no-store, must-revalidate");
          response.headers.set("Pragma", "no-cache");
          response.headers.set("Expires", "0");
        } else {
          // For other errors (network, etc.), keep the existing auth state
          console.warn(
            "Non-auth error during refresh, keeping auth state:",
            err
          );
          event.locals.pb = pb;
          event.locals.user = structuredClone(pb.authStore.model);
        }
      }
    } else {
      console.log("Auth store not valid");
      event.locals.pb = pb;
      event.locals.user = null;
    }
  } catch (err) {
    console.error("Error in auth handling:", err);
    console.error("Cookie at time of failure:", cookie);
    pb.authStore.clear();
    event.locals.pb = pb;
    event.locals.user = null;
  }

  // Protect chat routes
  if (event.url.pathname.startsWith("/chat")) {
    if (!pb.authStore.isValid) {
      console.log("Redirecting to login - auth not valid for chat route");
      throw redirect(303, "/login");
    }
  }

  const response = await resolve(event);

  return response;
};
