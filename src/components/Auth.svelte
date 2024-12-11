<script lang="ts">
  import { onAuthChange } from "$lib/auth";
  import { goto } from "$app/navigation";

  let email = "";
  let loading = false;
  let error = "";
  let success = "";

  async function handleSubmit() {
    loading = true;
    error = "";
    success = "";

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        success = result.message;
        email = "";
      } else {
        error = result.error;
      }
    } catch (e) {
      error = "An error occurred. Please try again.";
    } finally {
      loading = false;
    }
  }

  // Listen for auth changes
  onAuthChange((token, model) => {
    if (model) {
      goto("/chat"); // Redirect to chat when authenticated
    }
  });
</script>

<div class="max-w-md mx-auto p-6">
  <h2 class="text-2xl font-semibold mb-6">Sign In / Register</h2>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email address
      </label>
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        placeholder="Enter your email"
      />
    </div>

    {#if error}
      <p class="text-red-500 text-sm">{error}</p>
    {/if}

    {#if success}
      <p class="text-green-500 text-sm">{success}</p>
    {/if}

    <button
      type="submit"
      disabled={loading}
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary50 hover:bg-secondary60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary50"
    >
      {loading ? "Sending..." : "Continue with Email"}
    </button>
  </form>
</div>
