import { json } from "@sveltejs/kit";
import { pbUser } from "$lib/pocketbase";
import { getMusicHistorianResponse } from "$lib/server/gemini";
import { currentUserId } from "$lib/stores/user.js";

export async function POST({ request, locals }) {
  // if (!pbUser.authStore.isValid) {
  //   return json({ error: "Unauthorized" }, { status: 401 });
  // }

  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("pbUser.authStore.model from server", pbUser.authStore.model);

  const { message } = await request.json();

  const userId = locals.user.id;
  console.log("userId", userId);

  try {
    const response = await getMusicHistorianResponse(message);

    await pbUser.collection;

    const record = await pbUser.collection("messages").create({
      user: userId,
      message,
      response,
    });

    return json(record);
  } catch (error) {
    console.error("Error processing POST request:", error);
    return json({ error: "Failed to process request" }, { status: 400 });
  }
}

export async function GET() {
  if (!pbUser.authStore.isValid) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const records = await pbUser.collection("messages").getList(1, 50, {
      sort: "created",
      filter: `user = "${currentUserId}"`,
      // filter: `user = "${pbUser.authStore.model?.id}"`,
    });

    return json(records.items);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
