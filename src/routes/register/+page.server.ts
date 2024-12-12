import type { Actions } from "./$types";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = Object.fromEntries(await request.formData()) as {
      email: string;
      password: string;
      passwordConfirm: string;
    };

    try {
      // Create the user with required fields
      const userData = {
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        emailVisibility: true, // Required by PocketBase
      };

      await locals.pb.collection("users").create(userData);
      await locals.pb
        .collection("users")
        .authWithPassword(data.email, data.password);
    } catch (e) {
      console.error(e);
      throw e;
    }

    throw redirect(303, "/");
  },
};
