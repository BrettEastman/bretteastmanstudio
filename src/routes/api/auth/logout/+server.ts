import { pbUser } from "$lib/pocketbase";
import { json } from "@sveltejs/kit";

export async function POST() {
  pbUser.authStore.clear();
  const response = json({ message: "Logout successful", success: true });

  response.headers.set(
    "set-cookie",
    pbUser.authStore.exportToCookie({
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    })
  );

  return response;
}
