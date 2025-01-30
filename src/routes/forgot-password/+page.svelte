<script lang="ts">
  import { goto } from "$app/navigation";
  import { pbUser } from "$lib/pocketbase";

  let email = "";
  let loading = false;
  let errorMessage = "";
  let successMessage = "";

  async function handleSubmit() {
    loading = true;
    errorMessage = "";
    successMessage = "";

    try {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error("Please enter a valid email address");
      }

      // if email already exists in database?
      try {
        await pbUser.collection("users").getFirstListItem(`email="${email}"`);
      } catch (e) {
        console.log("Email check:", e);
      }

      await pbUser.collection("users").requestPasswordReset(email);

      successMessage =
        "If an account exists with this email, you will receive password reset instructions shortly.";

      // Do we want this delay?
      setTimeout(() => {
        goto("/login");
      }, 3000);
    } catch (e: any) {
      console.error("Forgot password error:", e);
      errorMessage =
        e.message ||
        "Failed to process password reset request. Please try again.";
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
        for="email"
        class="text-sm font-medium text-primary30 dark:text-secondary90"
      >
        Email
      </label>
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        disabled={loading}
        class="mt-1 p-2 w-full rounded-md border-primary50 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary50 focus:border-secondary50"
        placeholder="Enter your email address"
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary50 hover:bg-secondary60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary50 disabled:opacity-50 disabled:cursor-not-allowed duration-200"
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
        Reset Password
      {/if}
    </button>

    <div class="text-center mt-4">
      <a
        href="/login"
        class="text-sm text-secondary50 hover:text-secondary80 duration-200"
      >
        Back to Login
      </a>
    </div>
  </form>
</div>
