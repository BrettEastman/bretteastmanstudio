import { json } from "@sveltejs/kit";
import { pb } from "$lib/server/pocketbase";

export async function POST({ request }) {
  const { email } = await request.json();

  try {
    await pb.collection("users").requestVerification(email);

    return json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return json(
      {
        success: false,
        error: "Failed to send verification email",
      },
      { status: 400 }
    );
  }
}
