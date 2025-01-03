// import { pbUser, pbAdmin } from "$lib/pocketbase";
import { pbUser } from "$lib/pocketbase";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  console.log("Request received:", event.url.pathname);
  // Clear admin credentials if previously set
  // pbUser.authStore.clear();
  // pbAdmin.authStore.clear();
  // Get the auth cookie
  const cookie = event.request.headers.get("cookie") || "";
  pbUser.authStore.loadFromCookie(cookie);

  // if (pbUser.authStore.isValid) {
  //   console.log(
  //     "pbUser.authStore.model from hooks server:",
  //     pbUser.authStore.model
  //   );
  //   event.locals.user = structuredClone(pbUser.authStore.model);
  // } else {
  //   event.locals.user = null;
  // }

  try {
    // Verify and refresh the auth store if token exists
    if (pbUser.authStore.isValid) {
      await pbUser.collection("users").authRefresh();
      // Important: Set both pb and user in locals
      event.locals.pb = pbUser;
      event.locals.user = structuredClone(pbUser.authStore.model);
    } else {
      // Clear locals if not authenticated
      event.locals.pb = pbUser;
      event.locals.user = null;
    }
  } catch (err) {
    // Clear auth store and locals on error
    console.error("Error refreshing auth token:", err);
    pbUser.authStore.clear();
    event.locals.pb = pbUser;
    event.locals.user = null;
  }

  // try {
  //   // Verify and refresh the auth store
  //   if (pbUser.authStore.isValid) {
  //     await pbUser.collection("users").authRefresh();
  //   }
  // } catch (_) {
  //   // Clear the auth store on failed refresh
  //   pbUser.authStore.clear();
  // }

  // event.locals.pb = pbUser;
  // // event.locals.user = structuredClone(pbUser.authStore.model);
  // event.locals.user = pbUser.authStore.model;

  // Protect chat routes
  if (event.url.pathname.startsWith("/chat")) {
    if (!pbUser.authStore.isValid) {
      throw redirect(303, "/login");
    }
  }

  const response = await resolve(event);

  // Send the auth cookie back
  response.headers.set(
    "set-cookie",
    pbUser.authStore.exportToCookie({
      secure: false,
      httpOnly: false,
      path: "/",
    })
  );

  return response;
};
