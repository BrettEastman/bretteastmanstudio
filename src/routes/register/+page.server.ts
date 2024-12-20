import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = Object.fromEntries(await request.formData()) as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      passwordConfirm: string;
    };

    try {
      // Create the user with required fields
      const userData = {
        name: `${data.firstName} ${data.lastName}`,
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
