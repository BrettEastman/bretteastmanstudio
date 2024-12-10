import { json } from "@sveltejs/kit";
import { pb } from "$lib/server/pocketbase";
import { getMusicHistorianResponse } from "$lib/server/gemini";
import { EMAIL, PASSWORD } from "$env/static/private";

export async function POST({ request }) {
  const { message } = await request.json();

  try {
    const response = await getMusicHistorianResponse(message);

    const record = await pb.collection("messages").create({
      user: "user",
      message,
      response,
    });

    return json(record);
  } catch (error) {
    console.error("Error processing message:", error);
    return json({ error: "Failed to process message" }, { status: 500 });
  }
}

// export async function GET() {
//   try {
//     await pb.collection("_superusers").authWithPassword(EMAIL, PASSWORD);
//     // const authData = await pb.collection("messages").authWithPassword(EMAIL, PASSWORD);
//     const records = await pb.collection("messages").getList(1, 50, {
//       sort: "created",
//     });

//     return json(records.items);
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return json({ error: "Failed to fetch messages" }, { status: 500 });
//   }
// }
export async function GET() {
  try {
    await pb.admins.authWithPassword(EMAIL, PASSWORD);
    const records = await pb.collection("messages").getList(1, 50, {
      sort: "created",
    });

    return json(records.items);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
