<script>
  import { goto } from "$app/navigation";
  import { pbUser } from "$lib/pocketbase";

  let email = "";
  let loading = false;

  async function handleSubmit() {
    loading = true;
    try {
      await pbUser.collection("users").requestPasswordReset(email);
      alert("Password reset email sent.");
      await goto("/login");
    } catch (e) {
      console.error("Forgot password error:", e);
      alert("Failed to send password reset email.");
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto p-6">
  <h2
    class="mb-4 text-2xl text-primary30 font-semibold text-center my-8 pb-4 dark:text-secondary90"
  >
    Forgot Password
  </h2>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <label
      for="email"
      class="block text-sm font-medium text-primary30 dark:text-secondary90"
    >
      Email
    </label>
    <input
      type="email"
      id="email"
      bind:value={email}
      required
      class="mt-1 block w-full rounded-md border-primary50 shadow-sm"
    />
    <button
      type="submit"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary50 hover:bg-secondary60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary50"
      >{loading ? "Sending..." : "Submit"}</button
    >
  </form>
</div>
