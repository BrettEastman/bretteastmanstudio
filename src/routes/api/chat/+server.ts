import { getMusicHistorianResponse } from "$lib/server/gemini";
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
    
    // Extract just the date part from lastQuestionDate for proper comparison
    const lastQuestionDateStr = user.lastQuestionDate ? user.lastQuestionDate.split(' ')[0] : '';
    const today = new Date().toISOString().split('T')[0];
    
    console.log("Initial state:", { 
      userId: locals.user.id,
      lastQuestionDate: user.lastQuestionDate, 
      lastQuestionDateStr,
      today, 
      initialQuestionCount: user.questionCount 
    });

    // Handle date change and question limit
    if (lastQuestionDateStr !== today) {
      console.log("Will reset count for new day");
    } else if (user.questionCount >= 10) {
      return json(
        { error: "Daily question limit reached. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const { message } = await request.json();
    const response = await getMusicHistorianResponse(message);

    // Create the message record
    const record = await locals.pb.collection("messages").create({
      user: locals.user.id,
      message,
      response,
    });

    // Update the user's question count
    try {
      // First, get a fresh copy of the user to avoid any stale data
      const freshUser = await locals.pb.collection("users").getOne(locals.user.id);
      
      // Log the entire user object to see all fields
      console.log("Complete user object before update:", JSON.stringify(freshUser));
      
      // Attempt to get schema information if possible
      try {
        const schema = await locals.pb.collections.getOne("users");
        console.log("User collection schema:", JSON.stringify(schema));
      } catch (schemaError) {
        console.log("Could not get schema info:", schemaError);
      }
      
      let newCount;
      // Extract just the date part from freshUser.lastQuestionDate for proper comparison
      const freshUserDateStr = freshUser.lastQuestionDate ? freshUser.lastQuestionDate.split(' ')[0] : '';
      
      if (freshUserDateStr !== today) {
        // First question of a new day
        newCount = 1;
        console.log("Setting count to 1 for new day");
      } else {
        // Increment the count for an existing day - explicitly parse as number
        const currentCount = parseInt(freshUser.questionCount, 10) || 0;
        newCount = currentCount + 1;
        console.log("Current count (parsed):", currentCount);
        console.log("New count will be:", newCount);
      }
      
      // Force to number
      newCount = Number(newCount);
      
      // Use a direct database update call with explicit typing
      const updateData = {
        questionCount: newCount,
        lastQuestionDate: today
      };
      
      console.log("Sending update data:", updateData);
      const updateResult = await locals.pb.collection("users").update(locals.user.id, updateData);
      
      // Log the entire result object
      console.log("Complete update result:", JSON.stringify(updateResult));
      
      // Verify with another fresh fetch and log entire object
      const verifyUser = await locals.pb.collection("users").getOne(locals.user.id);
      console.log("Complete user object after update:", JSON.stringify(verifyUser));
      
      // Extra check - try a raw query if available in PocketBase
      try {
        // This syntax depends on PocketBase's API and may not work
        const rawCheck = await locals.pb.send('/api/collections/users/records/' + locals.user.id, {
          method: 'GET',
        });
        console.log("Raw API response:", rawCheck);
      } catch (rawError) {
        console.log("Raw API check failed:", rawError);
      }
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
