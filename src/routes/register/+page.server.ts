import type { Actions } from "./$types";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = Object.fromEntries(await request.formData()) as {
      email: string;
      password: string;
      passwordConfirm: string;
    };

    // now that we have the form data, we can create the user and log them in
    try {
      await locals.pb.collection("users").create(data);
      await locals.pb
        .collection("users")
        .authWithPassword(data.email, data.password);
    } catch (e) {
      console.error(e);
      throw e;
    }

    redirect(303, "/");
  },
};
