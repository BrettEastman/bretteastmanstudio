import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
// We need to implement the log out action as a form action
export const actions: Actions = {
  default: async ({ locals }) => {
    locals.pb.authStore.clear();
    // locals.user = null;
    throw redirect(303, "/");
  },
};
