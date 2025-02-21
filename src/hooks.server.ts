import { pbUser } from "$lib/pocketbase";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // Get the auth cookie
  const cookie = event.request.headers.get("cookie") || "";
  console.log("Auth cookie present:", !!cookie);
  console.log("Request path:", event.url.pathname);
  console.log(
    "Environment:",
    import.meta.env.PROD ? "production" : "development"
  );

  try {
    // Load the auth state for this request
    pbUser.authStore.loadFromCookie(cookie);
    console.log("Auth store loaded, isValid:", pbUser.authStore.isValid);
    console.log("Auth token exists:", !!pbUser.authStore.token);

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

  // Send the auth cookie
  const cookieOptions = {
    // if import.meta.env.PROD is true, secure is set to true
    // otherwise, secure is set to false
    secure: import.meta.env.PROD,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  };
  console.log("Setting cookie with options:", cookieOptions);

  response.headers.set(
    "set-cookie",
    pbUser.authStore.exportToCookie(cookieOptions)
  );

  return response;
};
