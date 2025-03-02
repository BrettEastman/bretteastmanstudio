import { getMusicHistorianResponse } from "$lib/server/gemini";
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
    const today = new Date().toISOString().split("T")[0];

    if (user.lastQuestionDate !== today) {
      await locals.pb.collection("users").update(locals.user.id, {
        questionCount: 0,
        lastQuestionDate: today,
      });
    }

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

    // Return a more specific error code for auth failures
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
  let records: any;

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
    if (error instanceof Error) {
      console.error("Detailed error:", error.message, error.stack);
    } else {
      console.error("Unknown error:", error);
    }

    return json(
      {
        error: "Failed to fetch messages",
        code: "FETCH_ERROR",
        details: error instanceof Error ? error?.message : "Unknown error",
        records,
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
