import { json } from "@sveltejs/kit";
import { pbUser } from "$lib/pocketbase";
import { getMusicHistorianResponse } from "$lib/server/gemini";

export async function POST({ request, locals }) {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await locals.pb.collection("users").getOne(locals.user.id);
    const today = new Date().toISOString().split("T")[0];

    // Reset count if it's a new day
    if (user.lastQuestionDate !== today) {
      await locals.pb.collection("users").update(locals.user.id, {
        questionCount: 0,
        lastQuestionDate: today,
      });
    }

    // Check question limit
    if (user.questionCount >= 10) {
      return json(
        { error: "Daily question limit reached. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const { message } = await request.json();
    const response = await getMusicHistorianResponse(message);

    const record = await locals.pb.collection("messages").create({
      user: locals.user.id,
      message,
      response,
    });

    await locals.pb.collection("users").update(locals.user.id, {
      questionCount: user.questionCount + 1,
      lastQuestionDate: today,
    });

    return json(record);
  } catch (error) {
    console.error("Error processing request:", error);
    return json({ error: "Failed to process request" }, { status: 500 });
  }
}

export async function GET({ locals }) {
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
