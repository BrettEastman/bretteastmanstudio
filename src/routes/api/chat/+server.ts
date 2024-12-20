import { json } from "@sveltejs/kit";
import { pb } from "$lib/pocketbase";
import { getMusicHistorianResponse } from "$lib/server/gemini";

export async function POST({ request }) {
  if (!pb.authStore.isValid) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await request.json();

  try {
    const response = await getMusicHistorianResponse(message);

    const record = await pb.collection("messages").create({
      user: pb.authStore.model?.id,
      message,
      response,
    });

    return json(record);
  } catch (error) {
    console.error("Error processing message:", error);
    return json({ error: "Failed to process message" }, { status: 500 });
  }
}

export async function GET() {
  if (!pb.authStore.isValid) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const records = await pb.collection("messages").getList(1, 50, {
      sort: "created",
      filter: `user = "${pb.authStore.model?.id}"`,
    });

    return json(records.items);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
