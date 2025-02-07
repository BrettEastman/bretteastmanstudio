<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { pbUser } from "$lib/pocketbase";

  let password = $state("");
  let confirmPassword = $state("");
  let loading = $state(false);
  let errorMessage = $state("");
  let successMessage = $state("");

  const token: string | null = $page.url.searchParams.get("token");

  if (!token) {
    goto("/login");
  }

  async function handleSubmit() {
    loading = true;
    errorMessage = "";
    successMessage = "";

    try {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!token) {
        throw new Error("Invalid password reset token");
      }

      await pbUser
        .collection("users")
        .confirmPasswordReset(token, password, confirmPassword);

      successMessage = "Password successfully reset!";

      setTimeout(() => {
        goto("/login");
      }, 3000);
    } catch (e: any) {
      console.error("Password reset error:", e);
      errorMessage = e.message || "Failed to reset password. Please try again.";
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto p-6">
  <h2
    class="mb-4 text-2xl text-primary30 font-semibold text-center my-8 pb-4 dark:text-secondary90"
  >
    Reset Password
  </h2>

  {#if successMessage}
    <div class="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
      {successMessage}
    </div>
  {/if}

  {#if errorMessage}
    <div class="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
      {errorMessage}
    </div>
  {/if}

  <form onsubmit={preventDefault(handleSubmit)} class="space-y-4">
    <div>
      <label
        for="password"
        class="text-sm font-medium text-primary30 dark:text-secondary90"
      >
        New Password
      </label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        disabled={loading}
        class="mt-1 p-2 w-full rounded-md border-primary50 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary50 focus:border-secondary50 dark:focus:ring-4 dark:focus:ring-tertiary60 dark:focus:border-tertiary60"
        placeholder="Enter new password"
      />
    </div>

    <div>
      <label
        for="confirmPassword"
        class="text-sm font-medium text-primary30 dark:text-secondary90"
      >
        Confirm Password
      </label>
      <input
        type="password"
        id="confirmPassword"
        bind:value={confirmPassword}
        required
        disabled={loading}
        class="mt-1 p-2 w-full rounded-md border-primary50 shadow-sm focus:ring-secondary50 focus:border-secondary50"
        placeholder="Confirm new password"
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary50 hover:bg-secondary60 focus:outline-none focus:ring-2 focus:ring-secondary50 focus:border-secondary50 dark:focus:ring-4 dark:focus:ring-tertiary60 dark:focus:border-tertiary60 disabled:opacity-50 disabled:cursor-not-allowed duration-200"
    >
      {#if loading}
        <span class="inline-flex items-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      {:else}
        Set New Password
      {/if}
    </button>
  </form>
</div>
