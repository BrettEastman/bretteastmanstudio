import { json } from "@sveltejs/kit";
import { pbUser } from "$lib/pocketbase";
import { getMusicHistorianResponse } from "$lib/server/gemini";

export async function POST({ request, locals }) {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  // console.log("pbUser.authStore.model from server", pbUser.authStore.model);

  const { message } = await request.json();

  const userId = locals.user.id;
  console.log("locals.user", locals.user);

  try {
    const response = await getMusicHistorianResponse(message);
    // console.log("Attempting to create record with:", {
    //   user: userId,
    //   message,
    //   response,
    // });

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

export async function GET({ locals }) {
  // console.log("Full auth details:", {
  //   isValid: locals.pb?.authStore?.isValid,
  //   userId: locals.user?.id,
  //   model: locals.user,
  //   cookie: locals.pb?.authStore?.token,
  // });

  if (!locals.user || !locals.pb?.authStore?.isValid) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const records = await pbUser.collection("messages").getList(1, 50, {
      sort: "created",
      filter: `user = "${locals.user.id}"`,
    });

    return json(records.items);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
