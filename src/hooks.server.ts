import { pbUser } from "$lib/pocketbase";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // Get the auth cookie
  const cookie = event.request.headers.get("cookie") || "";
  
  try {
    // Load the auth state for this request
    pbUser.authStore.loadFromCookie(cookie);
    
    if (pbUser.authStore.isValid) {
      try {
        await pbUser.collection("users").authRefresh();
        event.locals.pb = pbUser;
        event.locals.user = structuredClone(pbUser.authStore.model);
      } catch (err) {
        // Handle refresh error
        console.error("Auth refresh failed:", err);
        event.locals.pb = pbUser;
        event.locals.user = null;
        pbUser.authStore.clear();
      }
    } else {
      event.locals.pb = pbUser;
      event.locals.user = null;
    }
  } catch (err) {
    console.error("Error in auth handling:", err);
    event.locals.pb = pbUser;
    event.locals.user = null;
  }

  // Protect chat routes
  if (event.url.pathname.startsWith("/chat")) {
    if (!pbUser.authStore.isValid) {
      throw redirect(303, "/login");
    }
  }

  const response = await resolve(event);

  // Send the auth cookie
  response.headers.append('set-cookie', pbUser.authStore.exportToCookie());

  return response;
};
