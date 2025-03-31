import { getMusicHistorianResponse } from "$lib/server/gemini";
import type { PrevMessage } from "$lib/types";
import type { RecordMessage, ListResult } from "$lib/types";
import { json } from "@sveltejs/kit";

export async function POST({ request, locals }) {
  if (!locals.user) {
    console.error("POST: No user in locals");
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!locals.pb?.authStore?.isValid) {
      console.error("POST: Auth store is invalid");
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await locals.pb.collection("users").getOne(locals.user.id);

    const lastQuestionDateStr = user.lastQuestionDate
      ? user.lastQuestionDate.split(" ")[0]
      : "";
    const today = new Date().toISOString().split("T")[0];

    if (lastQuestionDateStr !== today) {
      console.log("Will reset count for new day");
    } else if (user.questionCount >= 10) {
      return json(
        { error: "Daily question limit reached. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const { message } = await request.json();

    // Get last 5 messages for conversation history
    const recentMessages = await locals.pb
      .collection("messages")
      .getList(1, 5, {
        sort: "-created",
        filter: `user = "${locals.user.id}"`,
      });

    // Format previous messages for Gemini API
    const previousMessages: PrevMessage[] = recentMessages.items
      .reverse()
      .flatMap((item) => [
        {
          role: "user" as const,
          parts: [{ text: item.message }],
        },
        {
          role: "model" as const,
          parts: [{ text: item.response }],
        },
      ]);

    const response = await getMusicHistorianResponse(message, previousMessages);

    const record = await locals.pb.collection("messages").create({
      user: locals.user.id,
      message,
      response,
    });

    try {
      // Get a fresh copy of the user to avoid any stale data
      const freshUser = await locals.pb
        .collection("users")
        .getOne(locals.user.id);

      let newCount;
      const freshUserDateStr = freshUser.lastQuestionDate
        ? freshUser.lastQuestionDate.split(" ")[0]
        : "";

      if (freshUserDateStr !== today) {
        newCount = 1;
      } else {
        const currentCount = parseInt(freshUser.questionCount, 10) || 0;
        newCount = currentCount + 1;
      }

      const updateData = {
        questionCount: newCount,
        lastQuestionDate: today,
      };

      await locals.pb.collection("users").update(locals.user.id, updateData);
    } catch (error) {
      console.error("Error updating question count:", error);
    }

    return json(record, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
  }
}

export async function GET({ locals }) {
  if (!locals.user || !locals.pb?.authStore?.isValid) {
    console.error("GET: Authentication check failed", {
      hasUser: !!locals.user,
      isAuthValid: !!locals.pb?.authStore?.isValid,
    });

    return json(
      {
        error: "Authentication required",
        code: "AUTH_REQUIRED",
      },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  }

  let records: ListResult<RecordMessage>;

  try {
    records = await locals.pb.collection("messages").getList(1, 50, {
      sort: "created",
      filter: `user = "${locals.user.id}"`,
    });

    return json(records.items, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);

    return json(
      {
        error: "Failed to fetch messages",
        code: "FETCH_ERROR",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  }
}
