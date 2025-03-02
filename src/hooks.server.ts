import { redirect, type Handle } from "@sveltejs/kit";
import { createPocketBaseInstance } from "$lib/pocketbase";

export const handle: Handle = async ({ event, resolve }) => {
  const pbUser = createPocketBaseInstance();
  const cookie = event.request.headers.get("cookie") || "";
  console.log("Auth cookie present:", !!cookie);
  console.log("Request path:", event.url.pathname);
  console.log(
    "Environment:",
    import.meta.env.PROD ? "production" : "development"
  );

  pbUser.authStore.loadFromCookie(cookie);
  console.log("Auth store loaded, isValid:", pbUser.authStore.isValid);
  console.log("Auth token exists:", !!pbUser.authStore.token);

  try {
    if (pbUser.authStore.isValid) {
      try {
        await pbUser.collection("users").authRefresh();
        event.locals.pb = pbUser;
        event.locals.user = structuredClone(pbUser.authStore.model);
        console.log("Auth refresh successful, user:", event.locals.user?.id);
      } catch (err) {
        // Only clear auth if it's a real authentication error
        // @ts-expect-error - accessing error status
        if (err?.status === 401) {
          console.error("Auth refresh failed with 401, clearing auth:", err);
          event.locals.pb = pbUser;
          event.locals.user = null;
          pbUser.authStore.clear();

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
            pbUser.authStore.exportToCookie(cookieOptions)
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
          event.locals.pb = pbUser;
          event.locals.user = structuredClone(pbUser.authStore.model);
        }
      }
    } else {
      console.log("Auth store not valid");
      event.locals.pb = pbUser;
      event.locals.user = null;
    }
  } catch (err) {
    console.error("Error in auth handling:", err);
    console.error("Cookie at time of failure:", cookie);
    pbUser.authStore.clear();
    event.locals.pb = pbUser;
    event.locals.user = null;
  }

  // Protect chat routes
  if (event.url.pathname.startsWith("/chat")) {
    if (!pbUser.authStore.isValid) {
      console.log("Redirecting to login - auth not valid for chat route");
      throw redirect(303, "/login");
    }
  }

  const response = await resolve(event);

  return response;
};
