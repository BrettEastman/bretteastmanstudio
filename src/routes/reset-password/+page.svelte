<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { pbUser } from "$lib/pocketbase";

  let password = "";
  let confirmPassword = "";
  let loading = false;
  let errorMessage = "";
  let successMessage = "";

  // Get token from URL query parameter
  const token: string | null = $page.url.searchParams.get("token");

  // Redirect if no token present
  if (!token) {
    goto("/login");
  }

  async function handleSubmit() {
    loading = true;
    errorMessage = "";
    successMessage = "";

    try {
      // Validate password
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!token) {
        throw new Error("Invalid password reset token");
      }

      // Confirm password reset
      await pbUser
        .collection("users")
        .confirmPasswordReset(token, password, confirmPassword);

      successMessage = "Password successfully reset!";

      // Redirect to login after success
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

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label
        for="password"
        class="block text-sm font-medium text-primary30 dark:text-secondary90"
      >
        New Password
      </label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        disabled={loading}
        class="mt-1 block w-full rounded-md border-primary50 shadow-sm focus:ring-secondary50 focus:border-secondary50"
        placeholder="Enter new password"
      />
    </div>

    <div>
      <label
        for="confirmPassword"
        class="block text-sm font-medium text-primary30 dark:text-secondary90"
      >
        Confirm Password
      </label>
      <input
        type="password"
        id="confirmPassword"
        bind:value={confirmPassword}
        required
        disabled={loading}
        class="mt-1 block w-full rounded-md border-primary50 shadow-sm focus:ring-secondary50 focus:border-secondary50"
        placeholder="Confirm new password"
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary50 hover:bg-secondary60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary50 disabled:opacity-50 disabled:cursor-not-allowed"
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
