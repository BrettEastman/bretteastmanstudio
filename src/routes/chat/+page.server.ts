import { error, json } from "@sveltejs/kit";
import { pb } from "$lib/pocketbase";
import { getMusicHistorianResponse } from "$lib/server/gemini";
import { EMAIL, PASSWORD } from "$env/static/private";

export const load = async ({ locals }) => {
  console.log("User ID:", locals.user?.id); // Am I getting undefined here
  const pb = locals.pb;
  const userId = locals.user?.id;

  if (!userId) {
    throw error(403, "User not authenticated");
  }

  try {
    // Authenticate as admin first?
    await pb.admins.authWithPassword(EMAIL, PASSWORD);

    const messages = await pb.collection("messages").getFullList({
      filter: `user = "${userId}"`,
      sort: "created",
    });

    return { messages };
  } catch (e) {
    console.error("Error loading messages:", e);
    throw error(500, "Internal Server Error");
  }
};

export const actions = {
  sendMessage: async ({ request, locals }) => {
    const { message } = await request.json();
    const userId = locals.user?.id;

    if (!userId) {
      throw error(403, "User not authenticated");
    }

    try {
      // Authenticate as admin first?
      await pb.admins.authWithPassword(EMAIL, PASSWORD);

      const response = await getMusicHistorianResponse(message);

      const record = await pb.collection("messages").create({
        user: userId, // Associate the message with the user
        message,
        response,
      });

      return json(record);
    } catch (e) {
      console.error("Error processing message:", e);
      throw error(500, "Internal Server Error");
    }
  },
};
