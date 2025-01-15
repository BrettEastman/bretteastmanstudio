<script lang="ts">
  import { pbUser } from "$lib/pocketbase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  let firstName = "";
  let lastName = "";
  let loading = false;
  let error = "";
  let isRegistering = false;

  onMount(() => {
    pbUser.authStore.loadFromCookie(document.cookie);
  });

  async function handleSubmit() {
    loading = true;
    error = "";

    try {
      if (isRegistering) {
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error("First and last name are required");
        }

        await pbUser.collection("users").create({
          name: `${firstName.trim()} ${lastName.trim()}`,
          email,
          emailVisibility: true,
          password,
          passwordConfirm: password,
        });
      }

      const authData = await pbUser
        .collection("users")
        .authWithPassword(email, password);

      // Verify auth was successful
      // console.log("Auth successful:", {
      //   valid: pbUser.authStore.isValid,
      //   user: authData.record,
      // });

      // Save auth state to cookie
      document.cookie = pbUser.authStore.exportToCookie({
        httpOnly: false,
        secure: false,
        path: "/",
      });

      await goto("/chat");
    } catch (e) {
      console.error("Auth error:", e);
      error =
        e instanceof Error
          ? e.message
          : "Authentication failed. Please check your credentials.";
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto p-6">
  <h2
    class="mb-4 text-2xl text-primary30 font-semibold text-center my-8 pb-4 dark:text-secondary90"
  >
    {isRegistering ? "Create Account" : "Sign In"}
  </h2>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    {#if isRegistering}
      <div class="flex gap-4">
        <div class="flex-1">
          <label
            for="firstName"
            class="block text-sm font-medium text-primary30 dark:text-secondary90"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            bind:value={firstName}
            required={isRegistering}
            class="block mt-1 w-full rounded-md border-primary50 shadow-sm"
          />
        </div>
        <div class="flex-1">
          <label
            for="lastName"
            class="block text-sm font-medium text-primary30 dark:text-secondary90"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            bind:value={lastName}
            required={isRegistering}
            class="mt-1 block w-full rounded-md border-primary50 shadow-sm"
          />
        </div>
      </div>
    {/if}

    <div>
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
    </div>

    <div>
      <label
        for="password"
        class="block text-sm font-medium text-primary30 dark:text-secondary90"
      >
        Password
      </label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        class="mt-1 mb-5 block w-full rounded-md border-primary50 shadow-sm"
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
      on:click={() => {
        isRegistering = !isRegistering;
        error = "";
        if (!isRegistering) {
          firstName = "";
          lastName = "";
        }
      }}
      class="w-full text-sm text-secondary50 hover:text-secondary80 duration-200"
    >
      {isRegistering
        ? "Already have an account? Sign in here"
        : "Need an account? Register here"}
    </button>

    <button
      type="button"
      on:click={() => goto("/forgot-password")}
      class="w-full text-xs text-secondary50 hover:text-secondary80 duration-200"
      >Forgot password?</button
    >
  </form>
</div>
