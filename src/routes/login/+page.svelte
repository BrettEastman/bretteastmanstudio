<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let loading = false;
  let error = "";
  let isRegistering = false;

  async function handleSubmit() {
    loading = true;
    error = "";

    try {
      if (isRegistering) {
        await pb.collection("users").create({
          email,
          password,
          passwordConfirm: password,
        });
      }

      await pb.collection("users").authWithPassword(email, password);
      await goto("/chat");
    } catch (e) {
      console.error(e);
      error = "Authentication failed. Please check your credentials.";
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto p-6">
  <h2 class="text-2xl font-semibold mb-6">
    {isRegistering ? "Create Account" : "Sign In"}
  </h2>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>

    {#if error}
      <p class="text-red-500 text-sm">{error}</p>
    {/if}

    <button
      type="submit"
      disabled={loading}
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary50 hover:bg-secondary60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary50"
    >
      {loading ? "Processing..." : isRegistering ? "Register" : "Sign In"}
    </button>

    <button
      type="button"
      on:click={() => (isRegistering = !isRegistering)}
      class="w-full text-sm text-secondary50 hover:text-secondary60"
    >
      {isRegistering
        ? "Already have an account? Sign in"
        : "Need an account? Register"}
    </button>
  </form>
</div>
